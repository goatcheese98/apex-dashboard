import { describe, expect, it } from 'vitest'
import { decodeTournamentJSON, IMPORT_LIMITS } from './importJSON'

describe('bounded JSON decoding', () => {
  it('accepts valid UTF-8 JSON at the byte limit', () => {
    expect(decodeTournamentJSON('0' + ' '.repeat(IMPORT_LIMITS.bytes - 1))).toBe(0)
    expect(decodeTournamentJSON('{"name":"é"}')).toEqual({ name: 'é' })
  })
  it('rejects oversized ASCII and multi-byte text instead of trusting character counts', () => {
    expect(() => decodeTournamentJSON(' '.repeat(IMPORT_LIMITS.bytes + 1))).toThrow(/at most 2 MB.*split/)
    expect(() => decodeTournamentJSON('"' + 'é'.repeat(1_000_000) + '"')).toThrow(/at most 2 MB.*split/)
  })
  it('gives bounded syntax guidance without echoing file content', () => {
    try { decodeTournamentJSON('{"private-data":'); expect.fail('should reject') } catch (error) {
      expect((error as Error).message).toMatch(/^File: Invalid JSON;.*corrected file/)
      expect((error as Error).message).not.toContain('private-data')
      expect((error as Error).message.length).toBeLessThan(250)
    }
  })
})
