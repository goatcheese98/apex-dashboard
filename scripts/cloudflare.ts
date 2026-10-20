import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

// Deliberately exposes only local rehearsal and packaging, never a deployment command.
const mode = process.argv[2]
if (mode !== 'local' && mode !== 'dry-run') throw new Error('Use local or dry-run')
const configHome = resolve('work/wrangler-config')
await mkdir(configHome, { recursive: true })
const args = mode === 'local'
  ? ['dev', '--local', '--ip', '127.0.0.1', '--port', '8787', '--persist-to', 'work/wrangler-state']
  : ['deploy', '--dry-run', '--outdir', 'work/cloudflare-dry-run']
const child = spawn(process.execPath, [resolve('node_modules/wrangler/bin/wrangler.js'), ...args], {
  stdio: 'inherit',
  detached: process.platform !== 'win32',
  env: {
    PATH: process.env.PATH ?? '',
    TMPDIR: process.env.TMPDIR ?? '/tmp',
    XDG_CONFIG_HOME: configHome,
    CI: 'true',
    WRANGLER_SEND_METRICS: 'false',
    CLOUDFLARE_LOAD_DEV_VARS_FROM_DOT_ENV: 'false',
    CLOUDFLARE_CF_FETCH_ENABLED: 'false',
  },
})
function stop(signal: NodeJS.Signals) {
  function send(value: NodeJS.Signals) {
    try {
      if (child.pid && process.platform !== 'win32') process.kill(-child.pid, value)
      else child.kill(value)
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ESRCH') throw error
    }
  }
  send(signal)
  const cleanup = setTimeout(() => send('SIGKILL'), 5000)
  cleanup.unref()
  child.once('exit', () => clearTimeout(cleanup))
}
for (const signal of ['SIGINT', 'SIGTERM'] as const) process.on(signal, () => stop(signal))
child.on('error', error => { console.error(error.message); process.exitCode = 1 })
child.on('exit', (code, signal) => { process.exitCode = code ?? (signal ? 1 : 0) })
