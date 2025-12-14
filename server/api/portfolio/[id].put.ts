import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!id) throw createError({ statusCode: 400, statusMessage: 'ID Required' })

  try {
    return await prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description,
        thumbnail: body.thumbnail,
        // Pastikan techStack disimpan sebagai JSON Array yang valid
        techStack: Array.isArray(body.techStack) ? body.techStack : [],
        repoUrl: body.repoUrl,
        demoUrl: body.demoUrl,
        isFeatured: body.isFeatured
      }
    })
  } catch (error: any) {
    console.error('Update Project Error:', error)
    if (error.code === 'P2002') {
      throw createError({ statusCode: 409, statusMessage: 'Slug URL sudah digunakan project lain.' })
    }
    throw createError({ statusCode: 500, statusMessage: 'Gagal mengupdate project.' })
  }
})