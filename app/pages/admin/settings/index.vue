<template>
  <div class="p-8 max-w-5xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">Global Settings</h1>
      <p class="text-muted-foreground">Konfigurasi identitas situs, SEO, dan profil.</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <Card class="h-fit">
        <CardHeader>
          <CardTitle>Branding & Assets</CardTitle>
          <CardDescription>Logo dan Favicon situs.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          <div class="space-y-2">
            <Label>Logo Situs (Header)</Label>
            <ImageUpload v-model="form.site_logo" />
            <p class="text-xs text-muted-foreground">Disarankan format PNG/SVG transparan.</p>
          </div>
          <div class="space-y-2">
            <Label>Favicon (Tab Browser)</Label>
            <div class="flex gap-4 items-center">
              <div v-if="form.site_favicon" class="h-10 w-10 border rounded p-1">
                <img :src="form.site_favicon" class="w-full h-full object-contain" />
              </div>
              <div class="flex-1">
                <Input v-model="form.site_favicon" placeholder="URL Favicon..." />
              </div>
            </div>
            </div>
        </CardContent>
      </Card>

      <Card class="lg:col-span-2">
        <CardHeader>
          <CardTitle>Informasi Situs & Profil</CardTitle>
        </CardHeader>
        <CardContent>
          <form @submit.prevent="saveSettings" class="space-y-6">
            
            <div class="grid md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label>Nama Situs (Site Title)</Label>
                <Input v-model="form.site_name" placeholder="Ulya Farhan Portfolio" />
              </div>
               <div class="space-y-2">
                <Label>Email Kontak</Label>
                <Input v-model="form.contact_email" />
              </div>
            </div>

            <div class="space-y-2">
              <Label>Bio Singkat (Hero)</Label>
              <Textarea v-model="form.bio_short" rows="2" />
            </div>

            <div class="space-y-2">
              <Label>Bio Lengkap (About Page)</Label>
              <ClientOnly>
                <TiptapEditor v-model="form.bio_long" />
              </ClientOnly>
            </div>

            <div class="grid md:grid-cols-2 gap-4 pt-4 border-t">
              <div class="space-y-2">
                <Label>Resume / CV Link</Label>
                <Input v-model="form.resume_url" placeholder="https://..." />
              </div>
              <div class="space-y-2">
                <Label>Hero CTA Text</Label>
                <Input v-model="form.hero_cta_text" placeholder="Explore Work" />
              </div>
            </div>

            <div class="flex justify-end pt-4">
              <Button type="submit" :disabled="loading">
                <Spinner v-if="loading" class="mr-2" />
                Simpan Perubahan
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import ImageUpload from '@/components/admin/ImageUpload.vue'
import TiptapEditor from '@/components/admin/TiptapEditor.vue'

// Shadcn imports
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/spinner/Spinner.vue'

definePageMeta({ layout: 'admin' })

const loading = ref(false)
const { data: settings, refresh } = await useFetch('/api/settings')

const form = reactive({
  site_name: 'DevPort',
  site_logo: '',
  site_favicon: '',
  bio_short: '',
  bio_long: '',
  contact_email: '',
  resume_url: '',
  hero_cta_text: 'Explore Work'
})

// Isi form jika data ada
if (settings.value) {
  Object.assign(form, settings.value)
}

const saveSettings = async () => {
  loading.value = true
  try {
    await $fetch('/api/settings', { method: 'POST', body: form })
    toast.success('Pengaturan disimpan!')
    await refresh()
  } catch (error) {
    toast.error('Gagal menyimpan')
  } finally {
    loading.value = false
  }
}
</script>