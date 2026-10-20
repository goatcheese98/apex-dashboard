import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'

// Exercise the retained local binaries, without HTTP, providers or real memory files.
const scratch = await mkdtemp(join(tmpdir(), 'apex-mcp-smoke-'))
try {
  for (const server of ['server-memory', 'server-sequential-thinking']) {
    const client = new Client({ name: 'apex-dependency-check', version: '1.0.0' })
    const transport = new StdioClientTransport({
      command: process.execPath,
      args: [resolve(`node_modules/@modelcontextprotocol/${server}/dist/index.js`)],
      env: { PATH: process.env.PATH ?? '', MEMORY_FILE_PATH: join(scratch, 'memory.jsonl'), DISABLE_THOUGHT_LOGGING: 'true' },
      stderr: 'pipe',
    })
    try {
      await client.connect(transport)
      const { tools } = await client.listTools()
      const name = server === 'server-memory' ? 'create_entities' : 'sequentialthinking'
      assert(tools.some(tool => tool.name === name))
      const result = await client.callTool({ name, arguments: server === 'server-memory'
        ? { entities: [{ name: 'apex-smoke', entityType: 'test', observations: ['isolated'] }] }
        : { thought: 'Check local protocol compatibility.', thoughtNumber: 1, totalThoughts: 1, nextThoughtNeeded: false } })
      assert(!result.isError)
      assert(Array.isArray(result.content) && result.content.length > 0)
      if (server === 'server-memory') {
        const graph = await client.callTool({ name: 'read_graph', arguments: {} })
        assert(JSON.stringify(graph.content).includes('apex-smoke'))
      }
      console.log(`${server}: initialize, listTools and tool round-trip passed`)
    } finally {
      await client.close()
    }
  }
} finally {
  await rm(scratch, { recursive: true, force: true })
}
