import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event)

  try {
    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt,
        coverImage: body.coverImage,
        isPublished: body.isPublished || false
      }
    })
    return post
  } catch (error: any) {
    if (error.code === 'P2002') { // Error kode Prisma untuk duplicate unique key
      throw createError({ statusCode: 409, statusMessage: 'Slug already exists' })
    }
    throw createError({ statusCode: 500, statusMessage: 'Failed to create post' })
  }
})