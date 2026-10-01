import assert from "node:assert/strict";
import test from "node:test";
import { getOrderStatusPresentation, ORDER_STATUS_PRESENTATION } from "../src/lib/menu/order-status-presentation.ts";

test("all six order statuses have bilingual presentation semantics", () => {
  const expected = {
    new: { ar: "جديد", en: "New", tone: "info", icon: "sparkles" },
    confirmed: { ar: "مؤكد", en: "Confirmed", tone: "indigo", icon: "circle-check" },
    preparing: { ar: "قيد التحضير", en: "Preparing", tone: "warning", icon: "clock" },
    ready: { ar: "جاهز", en: "Ready", tone: "success", icon: "package-check" },
    completed: { ar: "مكتمل", en: "Completed", tone: "neutral", icon: "check-circle" },
    cancelled: { ar: "ملغى", en: "Cancelled", tone: "danger", icon: "circle-x" },
  };

  assert.deepEqual(ORDER_STATUS_PRESENTATION, expected);
  for (const [status, presentation] of Object.entries(expected)) {
    assert.deepEqual(getOrderStatusPresentation(status), presentation);
  }
});

test("unknown status input returns null instead of inventing presentation", () => {
  assert.equal(getOrderStatusPresentation("unknown"), null);
});
