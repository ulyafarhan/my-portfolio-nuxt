import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { serverSupabaseUser } from '#supabase/server'
import { prisma } from '../../utils/prisma'


export default defineEventHandler(async (event) => {
  // 1. Cek User Login
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  // 2. Ambil Config (Konsisten dengan upload.post.ts)
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
    const command = new ListObjectsV2Command({
      Bucket: config.r2BucketName,
      MaxKeys: 100
    })

    const response = await s3.send(command)
    
    // Construct URL Publik
    const publicDomain = config.public.r2PublicDomain?.replace(/\/$/, '')

    const files = response.Contents?.map((item) => ({
      key: item.Key,
      url: publicDomain ? `${publicDomain}/${item.Key}` : `/${item.Key}`, // Fallback
      size: item.Size,
      lastModified: item.LastModified
    })) || []

    // Sort by Date DESC
    return files.sort((a, b) => (b.lastModified?.getTime() || 0) - (a.lastModified?.getTime() || 0))

  } catch (error: any) {
    console.error('Media List Error:', error)
    throw createError({ statusCode: 500, statusMessage: error.message || 'Gagal mengambil media' })
  }
})