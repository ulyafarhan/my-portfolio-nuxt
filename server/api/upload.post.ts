import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // 1. Keamanan: Cek Login
  const user = await serverSupabaseUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  // 2. Cek Konfigurasi (Debugging)
  const config = useRuntimeConfig()
  
  // Validasi Config R2 sebelum lanjut
  if (!config.r2AccountId || !config.r2AccessKeyId || !config.r2SecretAccessKey || !config.r2BucketName) {
    console.error('❌ [Upload Error] Missing R2 Configuration in .env')
    console.error('Config values:', {
      accountId: config.r2AccountId ? 'Set' : 'Missing',
      bucket: config.r2BucketName ? 'Set' : 'Missing',
      accessKey: config.r2AccessKeyId ? 'Set' : 'Missing'
    })
    throw createError({ 
      statusCode: 500, 
      statusMessage: 'Server Misconfiguration: Missing Storage Credentials' 
    })
  }

  // 3. Baca File
  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'No file uploaded' })
  }

  // Cari field dengan nama 'file', atau ambil yang pertama
  const file = formData.find(f => f.name === 'file') || formData[0]
  
  if (!file || !file.filename) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid file data' })
  }

  // 4. Inisialisasi S3 Client
  const s3 = new S3Client({
    region: 'auto',
    endpoint: `https://${config.r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: config.r2AccessKeyId,
      secretAccessKey: config.r2SecretAccessKey,
    },
  })

  // 5. Generate Nama File Aman
  const ext = file.filename.split('.').pop()
  // Sanitasi nama file agar hanya alphanumerik
  const safeName = Math.random().toString(36).substring(2, 15) + Date.now().toString(36)
  const fileName = `uploads/${safeName}.${ext}`

  // 6. Proses Upload
  try {
    const command = new PutObjectCommand({
      Bucket: config.r2BucketName,
      Key: fileName,
      Body: file.data,
      ContentType: file.type,
      CacheControl: 'public, max-age=31536000, immutable'
    })

    await s3.send(command)

    // 7. Construct Public URL
    // Pastikan domain tidak diakhiri slash '/'
    const publicDomain = config.public.r2PublicDomain?.replace(/\/$/, '')
    
    if (!publicDomain) {
      console.warn('⚠️ [Upload Warning] NUXT_R2_PUBLIC_DOMAIN not set. Returning raw path.')
    }

    return {
      url: publicDomain ? `${publicDomain}/${fileName}` : fileName
    }

  } catch (error: any) {
    console.error('❌ [Upload Failed] S3 Error:', error)
    // Tampilkan pesan error asli dari AWS SDK ke client untuk debugging (bisa dihapus di prod)
    throw createError({ 
      statusCode: 500, 
      statusMessage: `Upload failed: ${error.message || 'Unknown S3 error'}` 
    })
  }
})