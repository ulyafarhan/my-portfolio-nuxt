import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // 1. Keamanan: Cek Login
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  // 2. Baca File
  const formData = await readMultipartFormData(event)
  const file = formData?.[0]
  
  if (!file || !file.filename) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }

  // 3. Konfigurasi R2
  const config = useRuntimeConfig()
  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${config.r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.r2AccessKeyId,
      secretAccessKey: config.r2SecretAccessKey,
    },
  })

  // 4. Generate Nama Unik
  const ext = file.filename.split('.').pop()
  const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`

  // 5. Upload
  try {
    await s3.send(new PutObjectCommand({
      Bucket: config.r2BucketName,
      Key: fileName,
      Body: file.data,
      ContentType: file.type,
      // Cache control agar browser tidak download ulang terus menerus (Performance)
      CacheControl: 'public, max-age=31536000, immutable' 
    }))

    // 6. Return URL CDN
    return {
      url: `${config.public.r2PublicDomain}/${fileName}`
    }
  } catch (error) {
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: 'Upload failed' })
  }
})