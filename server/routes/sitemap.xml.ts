import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // 1. Ambil Data Dinamis dari Database
  const [projects, posts, settings] = await Promise.all([
    prisma.project.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    prisma.setting.findUnique({ where: { key: 'site_url' } }) // Opsional: jika ada setting URL
  ])

  // Base URL (Gunakan env variable untuk produksi)
  const baseUrl = process.env.PUBLIC_SITE_URL || 'https://ulyafarhan.com'

  // 2. Definisi Halaman Statis
  const staticPages = [
    { loc: '', priority: 1.0 },
    { loc: '/projects', priority: 0.8 },
    { loc: '/blog', priority: 0.8 },
    { loc: '/about', priority: 0.7 },
    { loc: '/contact', priority: 0.6 },
  ]

  // 3. Generate XML String
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page.loc}</loc>
    <changefreq>weekly</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('')}

  ${projects.map(project => `
  <url>
    <loc>${baseUrl}/projects/${project.slug}</loc>
    <lastmod>${project.updatedAt.toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}

  ${posts.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`

  // 4. Set Header XML
  setResponseHeader(event, 'Content-Type', 'application/xml')
  
  return sitemap
})