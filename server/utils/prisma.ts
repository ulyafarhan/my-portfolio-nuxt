import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const { Pool } = pg

// Fungsi inisialisasi (hanya jalan saat dipanggil)
function getPrismaInstance() {
  // Cegah multiple instance saat hot-reload
  const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
  if (globalForPrisma.prisma) return globalForPrisma.prisma

  // Setup Adapter
  const connectionString = process.env.DATABASE_URL
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)

  // Buat Instance
  const prismaInstance = new PrismaClient({ adapter })

  // Simpan ke global di development
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaInstance
  
  return prismaInstance
}

// EXPORT PROXY:
// Ini teknik kuncinya. Variabel 'prisma' tersedia global, 
// tapi koneksi baru dibuka saat pertama kali dipakai (Lazy).
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    const client = getPrismaInstance()
    return Reflect.get(client, prop)
  }
})