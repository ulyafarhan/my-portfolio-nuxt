import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' }
    })
    return services
  } catch (error: any) {
    console.error('❌ GET Services Error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Gagal mengambil data services' })
  }
})