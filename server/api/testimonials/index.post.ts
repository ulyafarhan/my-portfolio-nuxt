import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event)
  
  try {
    return await prisma.testimonial.create({
      data: {
        clientName: body.clientName,
        company: body.company,
        role: body.role,
        content: body.content,
        avatarUrl: body.avatarUrl,
        rating: body.rating || 5,
        isShow: body.isShow ?? true
      }
    })
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create testimonial' })
  }
})