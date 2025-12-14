import { defineConfig } from '@prisma/config'
import dotenv from 'dotenv'
import fs from 'node:fs'
import path from 'node:path'

// Load Env Manual
const envPath = path.resolve(process.cwd(), '.env')
if (fs.existsSync(envPath)) dotenv.config({ path: envPath })

export default defineConfig({
  // Path ke schema
  schema: 'prisma/schema.prisma',
  
  // Tambahkan bagian migrations untuk mendefinisikan perintah seed
  migrations: {
    // Gunakan tsx untuk menjalankan file seed.ts
    // Pastikan 'tsx' sudah terinstall sebagai devDependency (sudah ada di package.json)
    seed: 'tsx prisma/seed.ts',
  },
  
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || ''
  }
})