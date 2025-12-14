import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  return await prisma.blogPost.update({
    where: { id },
    data: {
      title: body.title,
      slug: body.slug,
      content: body.content,
      excerpt: body.excerpt,
      coverImage: body.coverImage,
      isPublished: Boolean(body.isPublished)
    }
  })
})