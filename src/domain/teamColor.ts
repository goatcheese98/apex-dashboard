// Deliberately limited to literal hex and numeric HSL; no CSS expressions or URLs.
// The caller bounds text to 200 characters before invoking this grammar.
const number = /^(?:[-+]?(?:\d+(?:\.\d+)?|\.\d+)(?:e[-+]?\d+)?)(%|deg|grad|rad|turn)?$/i
const trim = (value: string) => value.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, '')
function numeric(value: string, units: readonly string[]): boolean {
  const match = number.exec(value)
  return !!match && units.includes((match[1] ?? '').toLowerCase()) && Number.isFinite(Number(value.slice(0, value.length - (match[1]?.length ?? 0))))
}
export function isTeamColor(color: string): boolean {
  if (/^#(?:[\da-f]{3}|[\da-f]{4}|[\da-f]{6}|[\da-f]{8})$/i.test(color)) return true
  const match = /^hsl\(([^()]*)\)$/i.exec(color)
  if (!match) return false
  const body = match[1]
  if (body.includes(',')) {
    const parts = body.split(',').map(trim)
    return (parts.length === 3 || parts.length === 4)
      && numeric(parts[0], ['', 'deg', 'grad', 'rad', 'turn'])
      && numeric(parts[1], ['%']) && numeric(parts[2], ['%'])
      && (parts.length === 3 || numeric(parts[3], ['', '%']))
  }
  const parts = body.split('/').map(trim)
  const channels = parts[0].split(/[ \t\r\n\f]+/)
  return parts.length <= 2 && channels.length === 3
    && numeric(channels[0], ['', 'deg', 'grad', 'rad', 'turn'])
    && numeric(channels[1], ['', '%']) && numeric(channels[2], ['', '%'])
    && (parts.length === 1 || numeric(parts[1], ['', '%']))
}
