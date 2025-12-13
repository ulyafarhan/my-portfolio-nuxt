export default defineEventHandler(async (event) => {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        isPublished: true,
        createdAt: true,
        // Kita tidak ambil 'content' di sini agar payload ringan
      }
    })
    return posts
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch posts' })
  }
})