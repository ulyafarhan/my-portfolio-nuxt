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

// 3. Masukkan ke Constructor
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Start seeding via Adapter...')
  
  try {
    // Clear existing data (Wajib untuk re-seeding)
    await prisma.project.deleteMany()
    await prisma.setting.deleteMany()
    await prisma.pageSection.deleteMany()
    await prisma.testimonial.deleteMany()
    await prisma.socialLink.deleteMany()

  // 1. SEED SERVICES
  await prisma.service.deleteMany()
  await prisma.service.createMany({
    data: [
      {
        title: 'UI/UX Design',
        description: 'Desain modern yang fokus pada konversi user.',
        price: 'Start from Rp 3jt',
        features: ['Figma Source File', 'Interactive Prototype', 'Style Guide', '3x Revisi'],
        iconKey: 'PaletteIcon',
        order: 1
      },
      {
        title: 'Fullstack Web',
        description: 'Aplikasi web kompleks dengan performa tinggi.',
        price: 'Start from Rp 8jt',
        features: ['Nuxt 4 + Supabase', 'SEO Optimized', 'CMS Admin Panel', 'Free Domain 1 Year'],
        isPopular: true,
        iconKey: 'CodeIcon',
        order: 2
      },
      {
        title: 'Maintenance',
        description: 'Jaga website tetap aman dan cepat.',
        price: 'Rp 500rb / bln',
        features: ['Weekly Backup', 'Security Patching', 'Content Update', 'Priority Support'],
        iconKey: 'ShieldCheckIcon',
        order: 3
      }
    ]
  })

  // 2. REGISTER SECTION BARU (Upsert agar tidak duplikat)
  await prisma.pageSection.upsert({
    where: { key: 'services' },
    update: {},
    create: {
      key: 'services',
      label: 'Services & Pricing',
      component: 'SectionServices',
      order: 2, // Taruh setelah Hero
      content: { title: 'Pricing Packages', subtitle: 'Investasi terbaik untuk bisnis Anda.' }
    }
  })

  console.log('✅ Services seeded!')
  } catch (e) {
    console.log('⚠️  Tables empty or not found, skipping delete...')
  }

  // --- 1. SEED DEFAULT PROJECT ---
  await prisma.project.create({
    data: {
      slug: 'nuxt-serverless-cms',
      title: 'Nuxt 4 Fullstack CMS (The Project Itself)',
      description: 'A bleeding-edge portfolio system built with Vue 3, Prisma 7, and Cloudflare R2, designed for high performance and professional scalability.',
      thumbnail: 'https://placehold.co/600x400',
      techStack: ['Nuxt 4', 'Prisma Adapter', 'Supabase', 'Cloudflare R2'],
      isFeatured: true
    }
  })

  // --- 2. SEED DEFAULT SETTINGS ---
  const settings = {
      site_name: 'DevPort',
      site_logo: '',
      site_favicon: '',
      bio_short: 'Fullstack Engineer obsessed with building high-performance, edge-native applications.',
      bio_long: 'I specialize in Vue ecosystem (Nuxt/Vue 3) and leveraging serverless technology (Nitro, R2, Supabase) to deliver scalable and resilient applications.',
      contact_email: 'hello@ulyafarhan.com',
      resume_url: '#',
      hero_cta_text: 'See My Work',
      // Theme defaults
      font_family: 'Inter',
      theme_color: '#09090b', 
      theme_radius: '0.5'
  }
  
  // Menggunakan createMany lebih efisien untuk Settings
  await prisma.setting.createMany({
    data: Object.entries(settings).map(([key, value]) => ({ key, value }))
  })

  // --- 3. SEED DEFAULT SECTIONS (Layout Builder) ---
  const sections = [
    { 
      key: 'hero', 
      label: 'Hero Section', 
      component: 'SectionHero', 
      order: 1,
      content: { 
        title: 'BLEEDING EDGE.', 
        subtitle: 'Fullstack Engineer crafting robust architectures.',
        ctaText: 'Explore Work'
      }
    },
    { 
      key: 'projects', 
      label: 'Selected Works', 
      component: 'SectionProjects', 
      order: 2,
      content: { title: 'Selected Works' }
    },
    { 
      key: 'testimonials', 
      label: 'Client Testimonials', 
      component: 'SectionTestimonials', 
      order: 3,
      content: { title: 'Trusted by Clients' }
    },
    { 
      key: 'blog', 
      label: 'Latest Articles', 
      component: 'SectionBlog', 
      order: 4,
      content: { title: 'Thoughts & Insights' }
    },
    { 
      key: 'experience', 
      label: 'Work Experience', 
      component: 'SectionExperience', 
      order: 5,
      content: { title: 'My Career Journey' }
    },
    { 
      key: 'contact', 
      label: 'Contact Me', 
      component: 'SectionContact', 
      order: 6,
      content: { title: 'Get in Touch' }
    }
  ]

  for (const s of sections) {
    // Karena kita sudah deleteMany di atas, kita bisa langsung create
    await prisma.pageSection.create({
      data: {
        key: s.key,
        label: s.label,
        component: s.component,
        order: s.order,
        content: s.content as any // Cast karena tipe data 'content' adalah Json
      }
    })
  }

  // --- 4. SEED SOCIAL LINKS ---
  await prisma.socialLink.createMany({
    data: [
      { platform: 'GitHub', url: 'https://github.com/ulyafarhan', iconKey: 'GithubIcon', order: 10 },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/ulyafarhan', iconKey: 'LinkedinIcon', order: 20 },
      { platform: 'Twitter', url: 'https://x.com/ulyafarhan', iconKey: 'TwitterIcon', order: 30 }
    ]
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