import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  try {
    return await prisma.experience.update({
      where: { id },
      data: {
        position: body.position,
        company: body.company,
        location: body.location,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        description: body.description
      }
    })
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to update experience' })
  }
})