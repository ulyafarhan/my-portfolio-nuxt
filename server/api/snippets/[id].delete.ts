import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = getRouterParam(event, 'id')

  try {
    return await prisma.snippet.delete({
      where: { id }
    })
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to delete snippet' })
  }
})