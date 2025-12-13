<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
// Setup Meta Tags Global (SEO)
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - Ulya Farhan` : 'Ulya Farhan - Fullstack Bleeding Edge';
  },
  meta: [
    { name: 'description', content: 'Portfolio Profesional berbasis Nuxt 4, Supabase, dan AI.' }
  ]
})
</script>