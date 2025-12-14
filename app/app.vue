<script setup lang="ts">
import { computed } from 'vue'
import { hexToRgb } from '~/lib/utils' // Kita butuh helper ini nanti

// Fetch Settings Global
const { data: settings } = await useFetch('/api/settings', { key: 'global-settings' })

// Dynamic Styles
const dynamicStyles = computed(() => {
  const color = settings.value?.theme_color || '#000000'
  const radius = settings.value?.theme_radius || '0.5'
  const font = settings.value?.font_family || 'Inter'
  
  // Konversi Hex ke format yang bisa dipakai Tailwind v4 / CSS Vars
  // Kita inject langsung ke :root style
  return `
    :root {
      --primary: ${color} !important;
      --radius: ${radius}rem !important;
      --font-sans: '${font}', sans-serif !important;
    }
    .dark {
      --primary: ${color} !important;
    }
  `
})

// Dynamic Fonts Link
const fontLink = computed(() => {
  const font = settings.value?.font_family || 'Inter'
  return `https://fonts.googleapis.com/css2?family=${font.replace(' ', '+')}:wght@300;400;500;700&display=swap`
})

useHead({
  titleTemplate: (titleChunk) => {
    const siteName = settings.value?.site_name || 'Ulya Farhan'
    return titleChunk ? `${titleChunk} - ${siteName}` : siteName
  },
  link: [
    { rel: 'icon', type: 'image/x-icon', href: settings.value?.site_favicon || '/favicon.ico' },
    // Load Font Dinamis
    { rel: 'stylesheet', href: fontLink }
  ],
  style: [
    // Inject CSS Vars
    { children: dynamicStyles }
  ],
  meta: [
    { name: 'description', content: settings.value?.bio_short || 'Fullstack Developer Portfolio' }
  ]
})
</script>

<template>
  <div :style="{ fontFamily: `'${settings?.font_family || 'Inter'}', sans-serif` }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster />
  </div>
</template>