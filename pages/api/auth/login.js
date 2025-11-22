import { query } from '../../../lib/database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, password } = req.body || {}
  if (!email || !password) return res.status(400).json({ error: 'missing fields' })

  try {
    const rows = await query('SELECT id, password_hash FROM users WHERE email = ?', [email])
    if (!rows.length) return res.status(401).json({ error: 'invalid' })

    const user = rows[0]
    const ok = await bcrypt.compare(password, user.password_hash)
    if (!ok) return res.status(401).json({ error: 'invalid' })

    const token = jwt.sign({ uid: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.setHeader('Set-Cookie', `session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`)
    // return basic user info to the client
    const [userRow] = await query('SELECT id, email, username FROM users WHERE id = ?', [user.id])
    return res.status(200).json({ ok: true, user: userRow })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'server' })
  }
}