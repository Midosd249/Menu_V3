export const ORDER_SOUND_ASSET = "/order-alert.wav";
const MUTE_STORAGE_KEY = "menuun:order-sound-muted";

export type OrderSoundState = {
  enabled: boolean;
  muted: boolean;
};

type AudioLike = {
  preload: string;
  currentTime: number;
  play: () => Promise<void>;
};

type OrderSoundManagerOptions = {
  audioFactory?: () => AudioLike;
  storage?: Pick<Storage, "getItem" | "setItem"> | null;
};

const getDefaultStorage = (): Storage | null => {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const createDefaultAudio = (): AudioLike => {
  const audio = new Audio(ORDER_SOUND_ASSET);
  audio.preload = "auto";
  return audio;
};

export function createOrderSoundManager(options: OrderSoundManagerOptions = {}) {
  const audioFactory = options.audioFactory ?? createDefaultAudio;
  const storage = options.storage === undefined ? getDefaultStorage() : options.storage;
  const playedOrderIds = new Set<string>();
  const playingOrderIds = new Set<string>();
  let enabled = false;
  let muted = storage?.getItem(MUTE_STORAGE_KEY) === "1";

  const getState = (): OrderSoundState => ({ enabled, muted });

  const playAsset = async (): Promise<boolean> => {
    try {
      const audio = audioFactory();
      audio.currentTime = 0;
      await audio.play();
      return true;
    } catch {
      return false;
    }
  };

  const activate = async (): Promise<boolean> => {
    const success = await playAsset();
    if (success) enabled = true;
    return success;
  };

  const test = async (): Promise<boolean> => {
    if (!enabled) return false;
    return playAsset();
  };

  const setMuted = (value: boolean) => {
    muted = value;
    try {
      storage?.setItem(MUTE_STORAGE_KEY, value ? "1" : "0");
    } catch {
      // Local preference persistence is best effort.
    }
  };

  const playForOrder = async (orderId: string): Promise<boolean> => {
    if (!enabled || muted || playedOrderIds.has(orderId) || playingOrderIds.has(orderId)) {
      return false;
    }

    playingOrderIds.add(orderId);
    const success = await playAsset();
    playingOrderIds.delete(orderId);

    if (success) playedOrderIds.add(orderId);
    return success;
  };

  return {
    getState,
    activate,
    test,
    mute: () => setMuted(true),
    unmute: () => setMuted(false),
    playForOrder,
  };
}
