import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  // Ambil pesan, urutkan yang belum dibaca & terbaru
  const messages = await prisma.message.findMany({
    where: { isArchived: false },
    orderBy: [
      { status: 'asc' }, // UNREAD dulu
      { createdAt: 'desc' }
    ]
  })
  
  return messages
})