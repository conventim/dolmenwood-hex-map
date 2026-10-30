export function isAvailableNoteCopyDestination(
  sourceHex: string,
  targetHex: string,
  notesByHex: Record<string, unknown>,
): boolean {
  return sourceHex !== targetHex && !notesByHex[targetHex];
}
