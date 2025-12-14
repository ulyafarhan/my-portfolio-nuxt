import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    // Urutkan dari yang terbaru (startDate desc)
    const experiences = await prisma.experience.findMany({
      orderBy: { startDate: 'desc' }
    })
    return experiences
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch experiences' })
  }
})