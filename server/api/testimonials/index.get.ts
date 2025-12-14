export default defineEventHandler(async (event) => {
  try {
    return await prisma.testimonial.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch testimonials' })
  }
})