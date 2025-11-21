export default async function handler(req, res) {
  // Clear the session cookie (HttpOnly) so the browser / client no longer sends it.
  // Use both Max-Age=0 and an Expires in the past for broader client compatibility.
  const expires = new Date(0).toUTCString() // 1970-01-01
  const cookie = `session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0; Expires=${expires}`
  res.setHeader('Set-Cookie', cookie)
  return res.status(200).json({ ok: true })
}