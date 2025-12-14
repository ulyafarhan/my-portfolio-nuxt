import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  if (event.method === 'GET') {
    return await prisma.snippet.findMany({ orderBy: { createdAt: 'desc' } })
  }

  if (event.method === 'POST') {
    const user = await serverSupabaseUser(event)
    if (!user) throw createError({ statusCode: 401 })
    const body = await readBody(event)
    return await prisma.snippet.create({ data: body })
  }
})