import { defineEventHandler, readBody, createError } from 'h3'
import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validasi Server-side
  if (!body.name || !body.email || !body.content) {
    throw createError({ statusCode: 400, statusMessage: 'Semua field wajib diisi.' })
  }

  try {
    const message = await prisma.message.create({
      data: {
        name: body.name,
        email: body.email,
        subject: body.subject || 'No Subject',
        content: body.content
      }
    })

    // Log Aktivitas System (Optional)
    // await logActivity(event, 'NEW_MESSAGE', `Pesan baru dari ${body.name}`)

    return { success: true }
  } catch (error) {
    throw createError({ statusCode: 500, statusMessage: 'Gagal mengirim pesan.' })
  }
})