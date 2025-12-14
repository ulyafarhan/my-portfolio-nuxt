import { serverSupabaseUser } from '#supabase/server'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const config = useRuntimeConfig()

  try {
    // 1. Database Counts
    const [projects, blogs, messages, unreadMessages, snippets] = await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count(), // Pastikan nama model Prisma Anda benar (BlogPost atau Post?)
      prisma.message.count(),
      prisma.message.count({ where: { status: 'UNREAD' } }),
      prisma.snippet.count()
    ])

    // 2. R2 Media Count (Perlu request ke R2)
    let mediaCount = 0
    try {
      const s3 = new S3Client({
        region: 'auto',
        endpoint: `https://${config.r2AccountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: config.r2AccessKeyId,
          secretAccessKey: config.r2SecretAccessKey,
        },
      })
      // ListObjects hanya mengembalikan max 1000 item per page, 
      // untuk stats sederhana kita ambil 1 page saja cukup sebagai estimasi
      const r2Res = await s3.send(new ListObjectsV2Command({ Bucket: config.r2BucketName }))
      mediaCount = r2Res.KeyCount || 0
    } catch (e) {
      console.error('R2 Stats Error', e)
    }

    // 3. Return Flat Object untuk Dashboard
    return {
      projects,
      blogs,
      messages,
      unreadMessages,
      media: mediaCount,
      snippets
    }
  } catch (error) {
    console.error(error)
    return {
      projects: 0,
      blogs: 0,
      messages: 0,
      unreadMessages: 0,
      media: 0,
      snippets: 0
    }
  }
})