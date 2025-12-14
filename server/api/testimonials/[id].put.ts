import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  try {
    return await prisma.testimonial.update({
      where: { id },
      data: {
        clientName: body.clientName,
        company: body.company,
        content: body.content,
        avatarUrl: body.avatarUrl,
        rating: body.rating,
        isShow: body.isShow
      }
    })
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to update testimonial' })
  }
})