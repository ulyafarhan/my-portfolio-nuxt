import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '../../utils/prisma' 

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  return await prisma.project.update({
    where: { id },
    data: {
      title: body.title,
      slug: body.slug,
      description: body.description,
      thumbnail: body.thumbnail,
      techStack: body.techStack || [],
      repoUrl: body.repoUrl,
      demoUrl: body.demoUrl,
      isFeatured: Boolean(body.isFeatured)
    }
  })
})