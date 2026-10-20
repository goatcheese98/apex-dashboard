# Tournament import boundary

The existing JSON schema, team-scoped player IDs, ID-only imported labels, game filters and cumulative/individual arithmetic are preserved. Imports are validated completely before replacing current data. Failed imports retain prior data with a stale label; they do not partially apply or silently truncate a tournament.

## Explicit resource limits

| Boundary | Limit | Recovery |
| --- | --- | --- |
| File and decoded UTF-8 JSON | 2,000,000 bytes, inclusive | Export a smaller tournament file |
| Any schema collection | 1,000 entries (existing limit) | Split the collection/file |
| Sum of entries in schema collections | 20,000 | Split games into smaller tournament files |
| Distinct team/player pairs across games | 2,000 | Split the tournament; IDs repeated across games count once per team |
| Text, numeric values and game count | Existing limits unchanged | Correct the named field |

The aggregate budget counts teams, roster strings, games, game-team entries and player-stat entries. It is checked before mapping each collection; distinct-player tracking uses team-scoped sets. Unknown extra JSON fields are ignored as before. The byte limit bounds their input size. These limits reject excessive work with a field path and a recovery instruction; no data is silently dropped. They are local processing limits, not an altered team/player identity contract or new tournament fields.

Malformed JSON gets constant, bounded syntax guidance without reflecting file contents. Semantic failures identify the field/index, such as `games[1].teams[0].playerStats[0].damage`. Messages do not include the offending value or arbitrary identifiers. Correct the field in the file and select it again; Retry re-reads the previously selected file.

The byte limit is checked before file reading and again after decoding. A character-length check rejects very long strings before allocating another UTF-8 buffer; UTF-8 byte counting catches multibyte content. This decoder is strict TypeScript and returns unknown data for schema validation. The import path already contained TypeScript and Vue `script setup lang="ts"`; there was no remaining handwritten JavaScript there to wrap or claim as migrated.

Summarization now indexes teams and players by their existing stable IDs. It visits selected game-team/player entries once rather than repeatedly scanning team/player arrays. Team order, first-seen player order, addition order for each team/player, sample name mappings, filters and calculations are unchanged.

## Reproduced evidence

Four new regressions failed on `b019ee7013468959d31fe6ea857905c6b9e71fa6`: accepted cross-game expansion under 2 MB; accepted aggregate collection work beyond the budget; missing field paths; and 5,050 game-team reads for 100 teams. After repair all pass, including exact-budget acceptance and a deterministic read-count check (no timing threshold). UTF-8 size, safe JSON syntax, stale-data retention and field-error UI regressions also pass. Existing identity, selection, triangulation and timeline tests remain enabled.
