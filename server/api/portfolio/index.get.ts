import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '../../utils/prisma' 

export default defineEventHandler(async (event) => {
  // Cache control untuk performa di frontend publik, tapi fresh di admin
  setHeader(event, 'Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')
  return await prisma.project.findMany({ orderBy: { createdAt: 'desc' } })
})