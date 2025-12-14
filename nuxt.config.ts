export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  modules: [
    'shadcn-nuxt', 
    '@vueuse/nuxt', 
    '@nuxtjs/supabase',
    '@nuxthub/core',
  ],

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
      include: ['/admin(/*)?'],
      exclude: ['/admin/login', '/'],
      cookieRedirect: true,
    }
  },

  shadcn: {
    prefix: '',
    componentDir: './app/components/ui'
  },

  runtimeConfig: {
    r2AccountId: process.env.NUXT_R2_ACCOUNT_ID,
    r2AccessKeyId: process.env.NUXT_R2_ACCESS_KEY_ID,
    r2SecretAccessKey: process.env.NUXT_R2_SECRET_ACCESS_KEY,
    r2BucketName: process.env.NUXT_R2_BUCKET_NAME,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL,
      r2PublicDomain: process.env.NUXT_R2_PUBLIC_DOMAIN
    }
  },

  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' }
  },

  nitro: {
    compressPublicAssets: true,
    // Caching Strategy untuk API Publik (SWR)
    routeRules: {
      '/api/portfolio': { swr: 3600 }, // Cache 1 jam, revalidate background
      '/api/blog': { swr: 3600 },
      '/api/settings': { swr: 86400 }, // Cache 24 jam
      '/admin/**': { ssr: false } // Admin panel fully SPA
    }
  },

  compatibilityDate: '2025-01-01'
})