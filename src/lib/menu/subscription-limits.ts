export type PlanResource = "branches" | "products" | "team_members";

export class PlanLimitError extends Error {
  readonly resource: PlanResource;
  readonly current: number;
  readonly max: number;

  constructor(resource: PlanResource, current: number, max: number) {
    super(`PLAN_LIMIT:${resource}:${current}:${max}`);
    this.name = "PlanLimitError";
    this.resource = resource;
    this.current = current;
    this.max = max;
  }
}

export function assertLimit(current: number, max: number, resource: PlanResource) {
  if (!Number.isFinite(current) || !Number.isFinite(max) || max < 0) {
    throw new Error("INVALID_PLAN_LIMIT");
  }
  if (current >= max) throw new PlanLimitError(resource, current, max);
}
