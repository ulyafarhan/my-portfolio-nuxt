export default defineEventHandler(async (event) => {
  return await prisma.service.findMany({ orderBy: { order: 'asc' } })
})