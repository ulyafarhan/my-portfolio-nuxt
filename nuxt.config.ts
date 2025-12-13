export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  modules: ['shadcn-nuxt', '@vueuse/nuxt', '@nuxtjs/supabase'],

  css: ['~/assets/css/tailwind.css'],

  postcss: {
    plugins: {
      '@tailwindcss/postcss': {}, 
      autoprefixer: {},
    },
  },

  supabase: {
    redirectOptions: {
      login: '/admin/login',
      callback: '/confirm',
      include: ['/admin(/*)?'], // Hanya proteksi folder admin
      exclude: ['/admin/login', '/'], // Public routes
      cookieRedirect: true,
    }
  },

  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  runtimeConfig: {
    databaseUrl: process.env.DATABASE_URL,
    openRouterKey: process.env.OPENROUTER_KEY,
    cloudinaryName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    sessionPassword: process.env.NUXT_SESSION_PASSWORD,
    adminEmail: process.env.ADMIN_EMAIL,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    }
  },

  experimental: {
    viewTransition: true,
    renderJsonPayloads: true,
  },

  devtools: { enabled: true },
  compatibilityDate: '2025-01-01'
})