import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event)
  
  try {
    return await prisma.socialLink.create({
      data: {
        platform: body.platform,
        url: body.url,
        iconKey: body.iconKey,
        order: body.order || 0,
        isShow: body.isShow ?? true
      }
    })
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create link' })
  }
})