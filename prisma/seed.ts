import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config' 

const { Pool } = pg

// 1. Setup Koneksi via 'pg' Pool
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
const pool = new Pool({ connectionString })

// 2. Bungkus dengan Adapter Prisma
const adapter = new PrismaPg(pool)

// 3. Masukkan ke Constructor (Sesuai instruksi Error P1012)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Start seeding via Adapter...')
  
  try {
    await prisma.project.deleteMany()
    await prisma.setting.deleteMany()
  } catch (e) {
    console.log('⚠️  Tables empty, skipping delete...')
  }

  // Insert Data (Contoh Project)
  await prisma.project.create({
    data: {
      slug: 'portfolio-v2',
      title: 'Nuxt 4 Bleeding Edge',
      description: 'Built with Prisma 7 Driver Adapters',
      thumbnail: 'https://placehold.co/600x400',
      techStack: ['Nuxt 4', 'Prisma Adapter', 'Supabase'],
      isFeatured: true
    }
  })

  console.log('✅ Seeding Success!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end() // Tutup pool manual
  })