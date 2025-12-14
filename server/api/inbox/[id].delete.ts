import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = getRouterParam(event, 'id')

  // Hapus pesan
  const msg = await prisma.message.delete({ where: { id } })
  
  // Catat siapa yang menghapus (Security Feature!)
  await logActivity(event, 'DELETE_MESSAGE', `Menghapus pesan dari ${msg.name}`)

  return { success: true }
})