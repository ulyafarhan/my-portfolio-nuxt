import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    return await prisma.socialLink.findMany({
      orderBy: { order: 'asc' }
    })
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch social links' })
  }
})