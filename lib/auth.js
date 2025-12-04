import jwt from 'jsonwebtoken'

export async function getUserFromRequest(req) {
  // This function only runs server-side (via getInitialProps or API routes)
  try {
    const cookie = req?.headers?.cookie || ''
    const match = cookie.match(/(?:^|; )session=([^;]+)/)
    if (!match) return null
    const token = match[1]
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    
    // Dynamic import ensures mysql2 never enters client bundle
    const { query } = await import('./database')
    const rows = await query('SELECT id, email, username, isPro FROM users WHERE id = ?', [payload.uid])
    return rows[0] || null
  } catch (e) {
    console.error('getUserFromRequest error:', e.message)
    return null
  }
}