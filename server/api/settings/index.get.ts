export default defineEventHandler(async (event) => {
  try {
    // 'prisma' otomatis tersedia (Auto-import dari server/utils)
    const settings = await prisma.setting.findMany()
    
    const formatted = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {} as Record<string, string>)

    return formatted
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch settings'
    })
  }
})