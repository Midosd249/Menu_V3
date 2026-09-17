import { COMMERCIAL_PLANS, getCommercialPrice, type BillingInterval, type CommercialPlan } from "./commercial-catalog.ts";

export type PaymentCheckoutInput = {
  planCode: CommercialPlan["code"];
  billingInterval: BillingInterval;
};

export type PaymentCheckoutRequest = {
  planCode: CommercialPlan["code"];
  billingInterval: BillingInterval;
  amountSar: number;
  currency: "SAR";
};

export function buildPaymentCheckoutRequest(input: PaymentCheckoutInput): PaymentCheckoutRequest {
  const plan = COMMERCIAL_PLANS.find((candidate) => candidate.code === input.planCode);
  if (!plan) throw new Error("PLAN_NOT_FOUND");
  if (plan.code === "free") throw new Error("PAYMENT_NOT_REQUIRED");

  return {
    planCode: plan.code,
    billingInterval: input.billingInterval,
    amountSar: getCommercialPrice(plan, input.billingInterval),
    currency: "SAR",
  };
}

// This boundary intentionally stops before provider checkout creation.
// A future server endpoint must derive tenant/user identity from authenticated context,
// call buildPaymentCheckoutRequest with the server-authoritative catalog, and only then
// hand the resolved amount to an approved provider adapter. Client-supplied amount,
// tenant id, entitlement, or payment state must never be trusted.
