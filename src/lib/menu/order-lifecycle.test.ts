import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const ordersSource = await readFile(new URL("./orders.ts", import.meta.url), "utf8");

test("order lifecycle accepts only the defined forward/cancellation transitions and same-status no-op", async () => {
  const lifecycle = await import("./order-lifecycle.ts");
  const expected: Record<string, string[]> = {
    new: ["confirmed", "cancelled"],
    confirmed: ["preparing", "cancelled"],
    preparing: ["ready", "cancelled"],
    ready: ["completed", "cancelled"],
    completed: [],
    cancelled: [],
  };

  for (const [from, targets] of Object.entries(expected)) {
    for (const to of ["new", "confirmed", "preparing", "ready", "completed", "cancelled"]) {
      assert.equal(
        lifecycle.isOrderStatusTransitionAllowed(from, to),
        from === to || targets.includes(to),
        `${from} -> ${to}`,
      );
    }
  }
});

test("invalid lifecycle transitions expose a safe domain error without database details", async () => {
  const lifecycle = await import("./order-lifecycle.ts");
  const result = lifecycle.getOrderStatusTransitionError("completed", "new");

  assert.deepEqual(result, {
    ok: false,
    code: "invalid",
    error: "لا يمكن نقل الطلب إلى الحالة المطلوبة من حالته الحالية.",
  });
  assert.doesNotMatch(result.error, /sql|postgres|trigger|database|transition/i);
});

test("updateOrderStatus keeps authentication, authorization, audit, and concurrency boundaries server-side", () => {
  assert.match(ordersSource, /\.middleware\(\[authMiddleware\]\)/);
  assert.match(ordersSource, /const permission = await assertOrderAccess\(context\.userId, data\.id\)/);
  assert.match(ordersSource, /order_status_events/);
  assert.match(ordersSource, /o\.status = locked\.from_status/);
  assert.match(ordersSource, /for update/);
  assert.match(ordersSource, /insert into order_status_events/);
  assert.match(ordersSource, /from_status <> status/);
});

test("updateOrderStatus maps database lifecycle rejection to a safe domain error", () => {
  assert.match(ordersSource, /invalid order status transition|invalid_transition/i);
  assert.match(ordersSource, /code: "invalid"/);
});
