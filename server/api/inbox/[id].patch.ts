import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  try {
    return await prisma.message.update({
      where: { id },
      data: {
        status: body.status, // 'READ' | 'UNREAD' | 'ARCHIVED'
      }
    })
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to update message status' })
  }
})