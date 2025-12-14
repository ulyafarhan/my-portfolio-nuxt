import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  
  const id = getRouterParam(event, 'id')
  
  try {
    await prisma.testimonial.delete({ where: { id } })
    return { success: true }
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to delete' })
  }
})