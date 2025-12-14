import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event)
  
  // Validasi sederhana
  if (!body.position || !body.company || !body.startDate) {
    throw createError({ statusCode: 400, statusMessage: 'Data tidak lengkap' })
  }

  try {
    const experience = await prisma.experience.create({
      data: {
        position: body.position,
        company: body.company,
        location: body.location,
        startDate: new Date(body.startDate), // Pastikan format ISO
        endDate: body.endDate ? new Date(body.endDate) : null,
        description: body.description || ''
      }
    })
    return experience
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to create experience' })
  }
})