export default defineEventHandler(async (event) => {
  try {
    const [projects, blogs, publishedBlogs, testimonials, recentPosts] = await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count(),
      prisma.blogPost.count({ where: { isPublished: true } }),
      prisma.testimonial.count(),
      prisma.blogPost.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, title: true, createdAt: true, isPublished: true } })
    ])

    return {
      counts: {
        projects,
        blogs,
        publishedBlogs,
        testimonials
      },
      recentPosts
    }
  } catch (error) {
    return { counts: {}, recentPosts: [] }
  }
})