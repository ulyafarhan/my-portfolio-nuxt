<template>
  <div class="p-8 max-w-7xl mx-auto space-y-8">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
      <div class="text-sm text-muted-foreground">
        Terakhir update: {{ new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }) }}
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Project</CardTitle>
          <FolderIcon class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats?.projects || 0 }}</div>
          <p class="text-xs text-muted-foreground">+1 bulan ini</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Artikel Blog</CardTitle>
          <FileTextIcon class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats?.blogs || 0 }}</div>
          <p class="text-xs text-muted-foreground">{{ stats?.publishedBlogs || 0 }} published</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Testimoni</CardTitle>
          <MessageSquareQuoteIcon class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats?.testimonials || 0 }}</div>
          <p class="text-xs text-muted-foreground">Clients trust you</p>
        </CardContent>
      </Card>

       <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">API Health</CardTitle>
          <ActivityIcon class="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold text-green-600">99.9%</div>
          <p class="text-xs text-muted-foreground">Systems Operational</p>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card class="col-span-4">
        <CardHeader>
          <CardTitle>Artikel Terbaru</CardTitle>
          <CardDescription>Status publikasi terakhir.</CardDescription>
        </CardHeader>
        <CardContent>
           <div class="space-y-4">
             <div v-for="post in recentPosts" :key="post.id" class="flex items-center">
               <div class="ml-4 space-y-1">
                 <p class="text-sm font-medium leading-none">{{ post.title }}</p>
                 <p class="text-xs text-muted-foreground">{{ new Date(post.createdAt).toLocaleDateString() }}</p>
               </div>
               <div class="ml-auto font-medium">
                  <Badge :variant="post.isPublished ? 'default' : 'secondary'" class="text-[10px]">{{ post.isPublished ? 'Live' : 'Draft' }}</Badge>
               </div>
             </div>
           </div>
        </CardContent>
      </Card>
      
      <Card class="col-span-3">
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>Shortcut manajemen.</CardDescription>
        </CardHeader>
        <CardContent class="grid gap-2">
           <NuxtLink to="/admin/projects" class="flex items-center gap-2 rounded-md border p-3 hover:bg-accent transition-colors">
              <span class="font-bold">+</span> Project Baru
           </NuxtLink>
           <NuxtLink to="/admin/blog" class="flex items-center gap-2 rounded-md border p-3 hover:bg-accent transition-colors">
              <span class="font-bold">+</span> Artikel Baru
           </NuxtLink>
            <NuxtLink to="/admin/appearance" class="flex items-center gap-2 rounded-md border p-3 hover:bg-accent transition-colors">
              <PaletteIcon class="w-4 h-4" /> Ganti Tema
           </NuxtLink>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FolderIcon, FileTextIcon, MessageSquareQuoteIcon, ActivityIcon, PaletteIcon } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

definePageMeta({ layout: 'admin' })

// Fetch Stats Realtime
const { data } = await useFetch('/api/stats')
const stats = computed(() => data.value?.counts)
const recentPosts = computed(() => data.value?.recentPosts || [])
</script>