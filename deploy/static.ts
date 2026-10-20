// Only serves the built Vite artifact. No external fetch, API, database or secrets.
interface Env { ASSETS: { fetch(request: Request): Promise<Response> } }
export const SECURITY_HEADERS: Readonly<Record<string, string>> = {
  'Content-Security-Policy': "default-src 'none'; script-src 'self'; script-src-attr 'none'; style-src 'self' 'unsafe-inline'; style-src-elem 'self'; style-src-attr 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; worker-src 'none'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'none'",
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
}
function respond(request: Request, response: Response, cache: string): Response {
  const headers = new Headers(response.headers)
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value)
  headers.set('Cache-Control', cache)
  return new Response(request.method === 'HEAD' ? null : response.body, { status: response.status, statusText: response.statusText, headers })
}
function error(request: Request, status: number, message: string): Response {
  return respond(request, new Response(message, { status, headers: { 'Content-Type': 'text/plain; charset=utf-8', ...(status === 405 ? { Allow: 'GET, HEAD' } : {}) } }), 'no-store')
}
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'GET' && request.method !== 'HEAD') return error(request, 405, 'Method not allowed\n')
    const url = new URL(request.url)
    const asset = await env.ASSETS.fetch(request)
    if (asset.ok || asset.status === 304) {
      const fingerprinted = /^\/assets\/.+-[\w-]{8}\.(?:js|css|woff2)$/.test(url.pathname)
      return respond(request, asset, fingerprinted ? 'public, max-age=31536000, immutable' : 'no-cache')
    }
    // Never turn a missing resource (even a browser navigation) into index HTML.
    if (url.pathname.startsWith('/assets/') || /\.[^/]+$/.test(url.pathname)) return error(request, 404, 'Not found\n')
    const knownRoute = url.pathname === '/' || /^\/tournament\/[^/]+\/?$/.test(url.pathname)
    if (!knownRoute && !request.headers.get('Accept')?.includes('text/html')) return error(request, 404, 'Not found\n')
    url.pathname = '/index.html'; url.search = ''
    const index = await env.ASSETS.fetch(new Request(url, { method: request.method }))
    if (index.status !== 200) return error(request, 503, 'Built application unavailable\n')
    return respond(request, new Response(index.body, { status: knownRoute ? 200 : 404, headers: index.headers }), knownRoute ? 'no-cache' : 'no-store')
  },
}
