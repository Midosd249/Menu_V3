export type OrderDirection = "up" | "down";

export function moveByDirection<T extends { id: string }>(items: readonly T[], id: string, direction: OrderDirection): T[] {
  const next = [...items];
  const index = next.findIndex((item) => item.id === id);
  if (index < 0) return next;
  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

export function indexOrder<T extends { id: string }>(items: readonly T[], start = 10): Array<{ id: string; sortOrder: number }> {
  return items.map((item, index) => ({ id: item.id, sortOrder: start + index * 10 }));
}
