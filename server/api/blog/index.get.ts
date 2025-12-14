export default defineCachedEventHandler(async (event) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true }, 
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        slug: true,
        excerpt: true,
        coverImage: true,
        createdAt: true
      }
    })
    return posts
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'DB Error' })
  }
}, {
  maxAge: 60 * 60, 
  swr: true,       
  name: 'blog-list'
})