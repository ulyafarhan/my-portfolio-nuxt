import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const body = await readBody(event)
  if (!body.key) throw createError({ statusCode: 400, statusMessage: 'Key required' })

  const config = useRuntimeConfig()
  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${config.r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.r2AccessKeyId,
      secretAccessKey: config.r2SecretAccessKey,
    },
  })

  try {
    await s3.send(new DeleteObjectCommand({
      Bucket: config.r2BucketName,
      Key: body.key
    }))
    return { success: true }
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Gagal menghapus file' })
  }
})