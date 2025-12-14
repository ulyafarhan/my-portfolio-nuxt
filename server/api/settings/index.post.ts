import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event)
  
  if (!body || typeof body !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Invalid Data' })
  }

  try {
    // 'prisma' langsung bisa dipakai
    const operations = Object.entries(body).map(([key, value]) => {
      const valString = String(value || '')
      
      return prisma.setting.upsert({
        where: { key },
        update: { value: valString },
        create: { key, value: valString }
      })
    })

    await prisma.$transaction(operations)

    return { success: true }
  } catch (error: any) {
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: 'Failed to save settings' })
  }
})