import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  try {
    return await prisma.snippet.update({
      where: { id },
      data: {
        title: body.title,
        language: body.language,
        description: body.description,
        code: body.code
      }
    })
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to update snippet' })
  }
})