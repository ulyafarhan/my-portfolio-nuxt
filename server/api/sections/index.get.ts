import { prisma } from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  return await prisma.pageSection.findMany({
    orderBy: { order: 'asc' }
  })
})