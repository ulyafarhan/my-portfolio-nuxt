import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event) // { key: 'filename.jpg' }
  if (!body.key) throw createError({ statusCode: 400, statusMessage: 'Key required' })

  const R2 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT || '',
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
  })

  try {
    await R2.send(new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: body.key
    }))
    return { success: true }
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Gagal menghapus file.' })
  }
})