import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID required' })

  try {
    await prisma.blogPost.delete({ where: { id } })
    return { success: true }
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to delete post' })
  }
})