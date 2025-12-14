import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
  // Konfigurasi R2 Client (Sama seperti upload)
  const R2 = new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT || '',
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
  })

  try {
    const command = new ListObjectsV2Command({
      Bucket: process.env.R2_BUCKET_NAME,
      MaxKeys: 100 // Limit 100 file terbaru
    })

    const response = await R2.send(command)
    
    // Format response agar lebih bersih
    const files = response.Contents?.map((item) => ({
      key: item.Key,
      url: `${process.env.R2_PUBLIC_DOMAIN}/${item.Key}`,
      size: item.Size,
      lastModified: item.LastModified
    })) || []

    // Urutkan dari yang terbaru
    return files.sort((a, b) => (b.lastModified?.getTime() || 0) - (a.lastModified?.getTime() || 0))

  } catch (error) {
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: 'Gagal mengambil daftar file.' })
  }
})