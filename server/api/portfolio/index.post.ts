import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '../../utils/prisma' 

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const body = await readBody(event)

  if (!body.title || !body.slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Title and Slug are required'
    })
  }

  try {
    const project = await prisma.project.create({
      data: {
        title: body.title,
        slug: body.slug,
        description: body.description || '',
        thumbnail: body.thumbnail || '',
        techStack: body.techStack || [],
        demoUrl: body.demoUrl || null,
        repoUrl: body.repoUrl || null,
        isFeatured: body.isFeatured || false
      }
    })
    return project
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Slug already exists'
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    })
  }
})