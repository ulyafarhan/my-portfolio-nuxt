import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '../../utils/prisma' 

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event)
  
  // Validasi tipe data (safety check)
  const orderInt = parseInt(body.order)
  const featuresList = Array.isArray(body.features) ? body.features : []

  try {
    return await prisma.service.create({
      data: {
        title: body.title,
        description: body.description || '',
        price: body.price,
        features: featuresList,
        isPopular: Boolean(body.isPopular),
        order: isNaN(orderInt) ? 0 : orderInt,
        ctaUrl: body.ctaUrl || null,
        iconKey: body.iconKey || null
      }
    })
  } catch (error: any) {
    console.error('❌ Create Service Error:', error)
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
})