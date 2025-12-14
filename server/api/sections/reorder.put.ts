import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event) // Array of { id, order }
  
  if (!Array.isArray(body)) throw createError({ statusCode: 400, statusMessage: 'Invalid data' })

  // Transaction untuk update massal
  const operations = body.map((item) => 
    prisma.pageSection.update({
      where: { id: item.id },
      data: { order: item.order }
    })
  )

  await prisma.$transaction(operations)
  return { success: true }
})