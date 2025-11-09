import { getUserFromRequest } from '../../../lib/auth'

export default async function handler(req, res) {
  const user = await getUserFromRequest(req)
  res.status(200).json({ user })
}