export const logActivity = async (event: any, action: string, details: string) => {
  try {
    // Coba ambil IP (optional, tergantung proxy Vercel/Cloudflare)
    const headers = getRequestHeaders(event)
    const ip = headers['x-forwarded-for'] || headers['x-real-ip'] || 'unknown'

    await prisma.activityLog.create({
      data: {
        action,
        details,
        ipAddress: Array.isArray(ip) ? ip[0] : ip
      }
    })
  } catch (e) {
    console.error('Failed to log activity', e)
  }
}