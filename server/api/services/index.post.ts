import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event)
  return await prisma.service.create({
    data: {
      title: body.title,
      description: body.description,
      price: body.price,
      features: body.features || [], // Array string
      isPopular: body.isPopular || false,
      ctaUrl: body.ctaUrl,
      order: body.order || 0
    }
  })
})