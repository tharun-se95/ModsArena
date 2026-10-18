// The page's way to its bridge, in one place: this run's token (served in
// the page's HTML), and every request that changes something. A bridge that
// restarted has a new token; the page asks for it again (GET /token, which
// only the signed-in office page can read) and retries once, so an open
// office keeps working across restarts.

let token = typeof document === 'undefined' ? '' : document.querySelector('meta[name="agent-office-token"]')?.content || ''

// Whether this page was served by a bridge (the hosted demo has none).
export const hasBridge = () => Boolean(token)

export async function refreshToken() {
  if (!token) return
  try {
    const res = await fetch('/token', { cache: 'no-store' })
    if (res.ok) token = (await res.json()).token || token
  } catch {}
}

// POST a JSON body with the token; the Response, as fetch gives it.
export async function post(path, body) {
  const send = () => fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-agent-office-token': token },
    body: JSON.stringify(body),
  })
  const res = await send()
  if (res.status !== 403) return res
  const before = token
  await refreshToken()
  return token === before ? res : send()
}
