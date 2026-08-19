export function navigateHex(
  currentHex: string | null,
  dcol: number,
  drow: number,
  validHexIds: Set<string>,
): string | null {
  if (!currentHex) return null;
  const col = parseInt(currentHex.slice(0, 2), 10) + dcol;
  const row = parseInt(currentHex.slice(2, 4), 10) + drow;
  const target = String(col).padStart(2, "0") + String(row).padStart(2, "0");
  return validHexIds.has(target) ? target : null;
}

export type VisitedState = "partial" | "visited" | null;

export function nextVisitedState(current: VisitedState): VisitedState {
  if (!current) return "partial";
  if (current === "partial") return "visited";
  return null;
}

export function countProgress(
  visitedHexes: Map<string, string>,
  hexPages: Record<string, number>,
): { visited: number; partial: number } {
  let visited = 0;
  let partial = 0;
  visitedHexes.forEach((state, hexId) => {
    if (!hexPages[hexId]) return;
    if (state === "visited") visited++;
    else if (state === "partial") partial++;
  });
  return { visited, partial };
}
