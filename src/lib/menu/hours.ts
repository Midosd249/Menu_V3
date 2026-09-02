import type { BranchHour } from "./types";

export const DEFAULT_HOURS: Array<Omit<BranchHour, "branchId">> = [
  { weekday: 0, opensAt: "07:00", closesAt: "00:00", isClosed: false },
  { weekday: 1, opensAt: "07:00", closesAt: "00:00", isClosed: false },
  { weekday: 2, opensAt: "07:00", closesAt: "00:00", isClosed: false },
  { weekday: 3, opensAt: "07:00", closesAt: "00:00", isClosed: false },
  { weekday: 4, opensAt: "07:00", closesAt: "00:00", isClosed: false },
  { weekday: 5, opensAt: "13:00", closesAt: "00:00", isClosed: false },
  { weekday: 6, opensAt: "07:00", closesAt: "00:00", isClosed: false },
];
