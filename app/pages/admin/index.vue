<template>
  <div class="min-h-screen bg-background text-foreground p-4 md:p-8 w-full space-y-8">
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p class="text-muted-foreground">Selamat datang kembali, Master Architect.</p>
      </div>
      <div class="flex gap-2">
        <Button variant="outline" as-child>
          <a href="/" target="_blank">
            <ExternalLinkIcon class="mr-2 h-4 w-4" /> Lihat Website
          </a>
        </Button>
        <Button as-child>
          <NuxtLink to="/admin/projects">
            <PlusIcon class="mr-2 h-4 w-4" /> Project Baru
          </NuxtLink>
        </Button>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card class="bg-card text-card-foreground">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Projects</CardTitle>
          <FolderIcon class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats?.projects || 0 }}</div>
          <p class="text-xs text-muted-foreground mt-1">
            +2 bulan ini (Simulasi)
          </p>
        </CardContent>
      </Card>

      <Card class="bg-card text-card-foreground">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Total Artikel</CardTitle>
          <FileTextIcon class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats?.blogs || 0 }}</div>
          <p class="text-xs text-muted-foreground mt-1">
            Konten SEO aktif
          </p>
        </CardContent>
      </Card>

      <Card class="bg-card text-card-foreground">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Pesan Masuk</CardTitle>
          <MailIcon class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats?.messages || 0 }}</div>
          <p class="text-xs text-muted-foreground mt-1">
            {{ stats?.unreadMessages || 0 }} belum dibaca
          </p>
        </CardContent>
      </Card>

      <Card class="bg-card text-card-foreground">
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">Media Assets</CardTitle>
          <ImageIcon class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{{ stats?.media || 0 }}</div>
          <p class="text-xs text-muted-foreground mt-1">
            Disimpan di Cloudflare R2
          </p>
        </CardContent>
      </Card>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      
      <Card class="col-span-4 bg-card">
        <CardHeader>
          <CardTitle>Aksi Cepat</CardTitle>
          <CardDescription>Jalan pintas ke fitur yang sering digunakan.</CardDescription>
        </CardHeader>
        <CardContent class="grid grid-cols-2 md:grid-cols-3 gap-4">
           <NuxtLink to="/admin/blog" class="flex flex-col items-center justify-center gap-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
             <PenToolIcon class="h-6 w-6 text-primary" />
             <span class="text-sm font-medium">Tulis Artikel</span>
           </NuxtLink>
           <NuxtLink to="/admin/media" class="flex flex-col items-center justify-center gap-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
             <UploadCloudIcon class="h-6 w-6 text-blue-500" />
             <span class="text-sm font-medium">Upload File</span>
           </NuxtLink>
           <NuxtLink to="/admin/settings" class="flex flex-col items-center justify-center gap-2 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
             <SettingsIcon class="h-6 w-6 text-slate-500" />
             <span class="text-sm font-medium">Settings</span>
           </NuxtLink>
        </CardContent>
      </Card>

      <Card class="col-span-3 bg-card">
        <CardHeader>
          <CardTitle>System Health</CardTitle>
          <CardDescription>Status performa server & database.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">Database (Supabase)</span>
            <Badge variant="outline" class="text-green-600 bg-green-500/10 border-green-500/20">Operational</Badge>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">Storage (R2)</span>
            <Badge variant="outline" class="text-green-600 bg-green-500/10 border-green-500/20">Operational</Badge>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">Nuxt Server</span>
            <Badge variant="outline" class="text-green-600 bg-green-500/10 border-green-500/20">v4.0.0 (Compat)</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  FolderIcon, FileTextIcon, MailIcon, ImageIcon, 
  ExternalLinkIcon, PlusIcon, PenToolIcon, UploadCloudIcon, SettingsIcon 
} from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

definePageMeta({ layout: 'admin' })

// Fetch real stats from server
const { data: stats } = await useFetch('/api/stats', { key: 'admin-stats' })
</script>