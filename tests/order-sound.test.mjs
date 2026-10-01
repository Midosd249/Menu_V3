import assert from "node:assert/strict";
import testRunner from "node:test";
import { readFileSync } from "node:fs";

import { createOrderSoundManager } from "../src/lib/menu/order-sound.ts";

type FakeAudio = {
  preload: string;
  currentTime: number;
  play: () => Promise<void>;
};

function createAudioHarness(outcomes: boolean[]) {
  const calls: FakeAudio[] = [];
  let index = 0;
  const audioFactory = () => {
    const shouldPlay = outcomes[Math.min(index++, outcomes.length - 1)] ?? true;
    const audio: FakeAudio = {
      preload: "auto",
      currentTime: 0,
      play: async () => {
        if (!shouldPlay) throw new Error("playback blocked");
      },
    };
    calls.push(audio);
    return audio;
  };
  return { audioFactory, calls };
}

testRunner("order sound stays disabled until activation playback succeeds", async () => {
  const first = createAudioHarness([false]);
  const manager = createOrderSoundManager({ audioFactory: first.audioFactory, storage: null });

  assert.deepEqual(manager.getState(), { enabled: false, muted: false });
  assert.equal(await manager.activate(), false);
  assert.deepEqual(manager.getState(), { enabled: false, muted: false });

  const second = createAudioHarness([true]);
  const enabled = createOrderSoundManager({ audioFactory: second.audioFactory, storage: null });
  assert.equal(await enabled.activate(), true);
  assert.deepEqual(enabled.getState(), { enabled: true, muted: false });
});

testRunner("test sound uses the same playback path and reports failure", async () => {
  const failed = createAudioHarness([true, false]);
  const manager = createOrderSoundManager({ audioFactory: failed.audioFactory, storage: null });

  assert.equal(await manager.activate(), true);
  assert.equal(await manager.test(), false);
  assert.equal(failed.calls.length, 2);
});

testRunner("mute and unmute gate test playback", async () => {
  const harness = createAudioHarness([true, true]);
  const manager = createOrderSoundManager({ audioFactory: harness.audioFactory, storage: null });

  await manager.activate();
  manager.mute();
  assert.deepEqual(manager.getState(), { enabled: true, muted: true });
  assert.equal(await manager.playForOrder("order-muted"), false);
  assert.equal(await manager.test(), true);
  manager.unmute();
  assert.deepEqual(manager.getState(), { enabled: true, muted: false });
  assert.equal(await manager.test(), true);
  assert.equal(harness.calls.length, 3);
});

testRunner("disabled sound never attempts order playback", async () => {
  const harness = createAudioHarness([true]);
  const manager = createOrderSoundManager({ audioFactory: harness.audioFactory, storage: null });

  assert.equal(await manager.playForOrder("order-1"), false);
  assert.equal(harness.calls.length, 0);
});

testRunner("same order id is played once only after successful playback", async () => {
  const harness = createAudioHarness([true, true, false, true]);
  const manager = createOrderSoundManager({ audioFactory: harness.audioFactory, storage: null });

  await manager.activate();
  assert.equal(await manager.playForOrder("order-1"), true);
  assert.equal(await manager.playForOrder("order-1"), false);
  assert.equal(await manager.playForOrder("order-2"), true);
  assert.equal(harness.calls.length, 3);
});

testRunner("failed order playback is retryable and does not mark the order as played", async () => {
  const harness = createAudioHarness([true, false, true]);
  const manager = createOrderSoundManager({ audioFactory: harness.audioFactory, storage: null });

  await manager.activate();
  assert.equal(await manager.playForOrder("order-1"), false);
  assert.equal(await manager.playForOrder("order-1"), true);
  assert.equal(harness.calls.length, 3);
});

testRunner("different order ids have independent playback state", async () => {
  const harness = createAudioHarness([true, true, true]);
  const manager = createOrderSoundManager({ audioFactory: harness.audioFactory, storage: null });

  await manager.activate();
  assert.equal(await manager.playForOrder("order-1"), true);
  assert.equal(await manager.playForOrder("order-2"), true);
  assert.equal(await manager.playForOrder("order-1"), false);
  assert.equal(harness.calls.length, 3);
});

testRunner("StudioShell preserves visual alerts, Browser Notifications, and polling while adding sound", () => {
  const source = readFileSync("src/components/studio-shell.tsx", "utf8");

  assert.match(source, /setOrderAlert\(latest\)/);
  assert.match(source, /new Notification\(/);
  assert.match(source, /window\.setInterval\(\(\) => void poll\(\), 20_000\)/);
  assert.match(source, /getOrderNotificationSummary/);
  assert.match(source, /copy\.orderSound\.enable/);
  assert.match(source, /copy\.orderSound\.test/);
  assert.match(source, /copy\.orderSound\.mute/);
  assert.match(source, /copy\.orderSound\.unmute/);
  assert.match(source, /copy\.orderSound\.activationFailed/);
  assert.match(source, /copy\.orderSound\.playbackFailed/);
});

testRunner("order sound copy contains Arabic and English labels", () => {
  const source = readFileSync("src/lib/menu/i18n.ts", "utf8");

  assert.match(source, /enable: \{ ar: "تفعيل صوت الطلبات", en: "Enable order sound" \}/);
  assert.match(source, /test: \{ ar: "اختبار الصوت", en: "Test sound" \}/);
  assert.match(source, /mute: \{ ar: "كتم صوت الطلبات", en: "Mute order sound" \}/);
  assert.match(source, /unmute: \{ ar: "إلغاء كتم صوت الطلبات", en: "Unmute order sound" \}/);
});
