import assert from "node:assert/strict";
import test from "node:test";
import { getOrderStatusPresentation, ORDER_STATUS_PRESENTATION } from "./order-status-presentation.ts";

test("all six order statuses have bilingual presentation semantics", () => {
  assert.equal(Object.keys(ORDER_STATUS_PRESENTATION).length, 6);
  assert.deepEqual(Object.keys(ORDER_STATUS_PRESENTATION), ["new", "confirmed", "preparing", "ready", "completed", "cancelled"]);
  assert.equal(ORDER_STATUS_PRESENTATION.new.tone, "info");
  assert.equal(ORDER_STATUS_PRESENTATION.confirmed.tone, "indigo");
  assert.equal(ORDER_STATUS_PRESENTATION.preparing.tone, "warning");
  assert.equal(ORDER_STATUS_PRESENTATION.ready.tone, "success");
  assert.equal(ORDER_STATUS_PRESENTATION.completed.tone, "neutral");
  assert.equal(ORDER_STATUS_PRESENTATION.cancelled.tone, "danger");
});

test("status labels remain bilingual", () => {
  assert.deepEqual(
    Object.fromEntries(Object.entries(ORDER_STATUS_PRESENTATION).map(([status, value]) => [status, value.label])),
    {
      new: { ar: "جديد", en: "New" },
      confirmed: { ar: "مؤكد", en: "Confirmed" },
      preparing: { ar: "قيد التحضير", en: "Preparing" },
      ready: { ar: "جاهز", en: "Ready" },
      completed: { ar: "مكتمل", en: "Completed" },
      cancelled: { ar: "ملغى", en: "Cancelled" },
    },
  );
});

test("unknown status input returns null instead of inventing presentation", () => {
  assert.equal(getOrderStatusPresentation("unknown"), null);
});
