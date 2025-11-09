let pool

async function loadMysql() {
  const mod = await import('mysql2/promise')
  return mod.default || mod
}

export async function getPool() {
  if (typeof window !== 'undefined') {
    throw new Error('getPool called in browser')
  }
  if (!pool) {
    const mysql = await loadMysql()
    pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT || 3306),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })
  }
  return pool
}

export async function query(sql, params) {
  if (typeof window !== 'undefined') {
    throw new Error('query called in browser')
  }
  const p = await getPool()
  const [rows] = await p.execute(sql, params)
  return rows
}