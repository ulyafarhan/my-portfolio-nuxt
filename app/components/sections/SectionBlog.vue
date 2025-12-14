<script setup lang="ts">
import { ArrowRightIcon } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const props = defineProps<{ content: { title?: string } }>()
const { data: posts } = await useFetch('/api/blog', {
  transform: (data) => data.slice(0, 3) // Ambil 3 artikel terbaru
})
</script>

<template>
  <section class="container mx-auto px-6 py-20">
    <div class="flex items-center justify-between mb-10">
      <h2 class="text-3xl font-bold tracking-tight">{{ props.content.title || 'Latest from the Blog' }}</h2>
      <NuxtLink to="/blog" class="text-sm text-primary hover:underline flex items-center gap-1">
        Read All <ArrowRightIcon class="w-4 h-4" />
      </NuxtLink>
    </div>

    <div v-if="posts" class="grid gap-6 md:grid-cols-3">
      <Card v-for="post in posts" :key="post.id" class="flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
        <NuxtLink :to="`/blog/${post.slug}`">
          <div class="relative h-40 bg-muted">
            <img 
              :src="post.coverImage || 'https://placehold.co/400x200/94a3b8/e2e8f0?text=No+Cover'" 
              class="w-full h-full object-cover" 
              :alt="post.title" 
            />
          </div>
        </NuxtLink>
        <CardContent class="flex-1 p-4 space-y-3">
          <Badge variant="secondary" class="text-[10px]">{{ new Date(post.createdAt).toLocaleDateString() }}</Badge>
          <NuxtLink :to="`/blog/${post.slug}`" class="block">
            <CardTitle class="text-lg hover:text-primary transition-colors">{{ post.title }}</CardTitle>
          </NuxtLink>
          <p class="text-sm text-muted-foreground line-clamp-2">{{ post.excerpt }}</p>
        </CardContent>
      </Card>
    </div>
    <div v-else class="text-center text-muted-foreground py-10">Belum ada artikel yang dipublikasikan.</div>
  </section>
</template>