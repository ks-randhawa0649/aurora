import { query } from '../../../lib/database'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { email, password, username } = req.body || {}
  console.log('[/api/auth/register] incoming body:', { email, username })
  if (!email || !password) return res.status(400).json({ error: 'missing fields' })

  try {
    const existing = await query('SELECT id FROM users WHERE email = ?', [email])
    console.log('[/api/auth/register] existing rows for email:', existing && existing.length)
    if (existing.length) {
      console.log('[/api/auth/register] email exists, returning 409')
      return res.status(409).json({ error: 'email exists' })
    }

    const hash = await bcrypt.hash(password, 10)
    const result = await query(
      'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)',
      [email, username || null, hash]
    )
    const token = jwt.sign({ uid: result.insertId }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.setHeader('Set-Cookie', `session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800`)
    // return the created user basic info
    const [userRow] = await query('SELECT id, email, username FROM users WHERE id = ?', [result.insertId])
    console.log('[/api/auth/register] created user id:', userRow && userRow.id)
    return res.status(201).json({ ok: true, user: userRow })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'server' })
  }
}