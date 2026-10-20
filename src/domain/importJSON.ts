export const IMPORT_LIMITS = { bytes: 2_000_000, collection: 1000, entries: 20_000, players: 2000 } as const

export class TournamentImportError extends Error {
  constructor(path: string, reason: string) {
    super(`${path}: ${reason}`)
    this.name = 'TournamentImportError'
  }
}

export function decodeTournamentJSON(text: string): unknown {
  // Reject long strings before allocating a second UTF-8 buffer.
  if (text.length > IMPORT_LIMITS.bytes || new TextEncoder().encode(text).length > IMPORT_LIMITS.bytes) {
    throw new TournamentImportError('File', 'JSON must be at most 2 MB; split the tournament into smaller files')
  }
  try { return JSON.parse(text) as unknown }
  catch { throw new TournamentImportError('File', 'Invalid JSON; fix the syntax and export UTF-8 JSON, then choose the corrected file') }
}
