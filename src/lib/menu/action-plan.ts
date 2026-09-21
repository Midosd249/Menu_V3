import type { MenuProblem } from "./problem-detection";
export type MenuAction = { key: string; priority: "high" | "medium" | "low"; href: string; problemCount: number };
const priority: Record<string, MenuAction["priority"]> = { publish: "high", "tenant-active": "high", branch: "high", categories: "high", products: "high", "availability-all": "high", "name-ar": "high", category: "high", "description-ar": "medium", "description-en": "medium", "name-en": "medium", currency: "medium", duplicate: "medium", image: "low" };
const href: Record<string, string> = { publish: "/studio/settings", "tenant-active": "/studio/settings", branch: "/studio/branches", categories: "/studio/menu", products: "/studio/menu", "availability-all": "/studio/menu", "name-ar": "/studio/menu", category: "/studio/menu", "description-ar": "/studio/menu", "description-en": "/studio/menu", "name-en": "/studio/menu", currency: "/studio/menu", duplicate: "/studio/menu", image: "/studio/menu" };
export function buildMenuActionPlan(problems: MenuProblem[]): MenuAction[] {
  const groups = new Map<string, number>();
  for (const problem of problems) { const key = problem.key.split(":")[0]; groups.set(key, (groups.get(key) ?? 0) + 1); }
  const rank: Record<MenuAction["priority"], number> = { high: 0, medium: 1, low: 2 };
  return [...groups.entries()].map(([key, problemCount]) => ({ key, priority: priority[key] ?? "medium", href: href[key] ?? "/studio/menu", problemCount })).sort((a, b) => rank[a.priority] - rank[b.priority] || b.problemCount - a.problemCount).slice(0, 6);
}
