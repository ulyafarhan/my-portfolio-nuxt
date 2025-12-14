<script setup lang="ts">
import { Button } from '@/components/ui/button'

const props = defineProps<{ 
  content: { 
    title?: string, 
    subtitle?: string, 
    ctaText?: string,
    // Background Image/Video URL bisa ditambahkan di sini
  } 
}>()
</script>

<template>
  <section class="container mx-auto px-6 pt-32 pb-20">
    <div class="max-w-4xl">
      <h1 
        class="text-6xl md:text-8xl font-black tracking-tighter text-black dark:text-white mb-6 leading-[0.9]" 
        v-html="props.content.title || 'Welcome'"
      >
      </h1>
      <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
        {{ props.content.subtitle || 'Your journey starts here.' }}
      </p>
      
      <div class="mt-10 flex gap-4">
        <NuxtLink to="/projects" class="group relative px-8 py-3 rounded-full bg-black text-white font-medium overflow-hidden">
          <span class="relative">{{ props.content.ctaText || 'Explore Work' }}</span>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>