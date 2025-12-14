<template>
  <div class="p-8 max-w-5xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">Appearance</h1>
      <p class="text-muted-foreground">Sesuaikan tema, warna, dan tipografi website.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Theme Customizer</CardTitle>
          <CardDescription>Pilih gaya visual yang mencerminkan personal branding Anda.</CardDescription>
        </CardHeader>
        <CardContent class="space-y-6">
          
          <div class="space-y-3">
            <Label>Font Family</Label>
            <div class="grid grid-cols-2 gap-4">
              <button 
                v-for="font in fonts" 
                :key="font.value"
                type="button"
                @click="form.font_family = font.value"
                :class="[
                  'flex items-center justify-between rounded-md border-2 p-4 hover:bg-accent transition-all',
                  form.font_family === font.value ? 'border-black dark:border-white bg-accent' : 'border-transparent bg-muted/40'
                ]"
              >
                <span :style="{ fontFamily: font.value }">{{ font.label }}</span>
                <div v-if="form.font_family === font.value" class="h-2 w-2 rounded-full bg-primary" />
              </button>
            </div>
          </div>

          <div class="space-y-3">
            <Label>Warna Utama (Primary Color)</Label>
            <div class="flex flex-wrap gap-3">
              <button 
                v-for="color in colors" 
                :key="color.value"
                type="button"
                @click="form.theme_color = color.value"
                class="group relative flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                :style="{ backgroundColor: color.value }"
              >
                <CheckIcon v-if="form.theme_color === color.value" class="h-5 w-5 text-white mix-blend-difference" />
              </button>
              
              <div class="relative">
                <input 
                  type="color" 
                  v-model="form.theme_color" 
                  class="h-10 w-10 cursor-pointer rounded-full border-0 p-0 opacity-0 absolute inset-0"
                />
                <div class="flex h-10 w-10 items-center justify-center rounded-full border bg-background text-muted-foreground shadow-sm">
                  <PaletteIcon class="h-5 w-5" />
                </div>
              </div>
            </div>
            <p class="text-xs text-muted-foreground">Warna saat ini: <code class="bg-muted px-1 rounded">{{ form.theme_color }}</code></p>
          </div>

          <div class="space-y-3">
            <Label>Border Radius (Kelengkungan Sudut)</Label>
            <Slider 
              v-model="radiusValue" 
              :max="1.0" 
              :step="0.1" 
              class="w-full" 
            />
            <div class="flex justify-between text-xs text-muted-foreground">
              <span>0 (Kotak)</span>
              <span>0.5 (Default)</span>
              <span>1.0 (Bulat)</span>
            </div>
          </div>

        </CardContent>
        <CardFooter class="border-t bg-muted/20 px-6 py-4">
          <Button @click="saveSettings" :disabled="loading" class="ml-auto">
            <Spinner v-if="loading" class="mr-2" />
            Simpan Perubahan
          </Button>
        </CardFooter>
      </Card>

      <div class="space-y-4">
        <h3 class="text-sm font-medium text-muted-foreground">Live Preview (Dummy)</h3>
        <div 
          class="rounded-xl border bg-background p-6 shadow-sm space-y-6 overflow-hidden transition-all duration-500"
          :style="{
            '--radius': `${form.theme_radius}rem`,
            'font-family': form.font_family
          }"
        >
          <div class="space-y-4">
            <div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80"
              :style="{ backgroundColor: form.theme_color }"
            >
              New Release
            </div>
            <h1 class="text-3xl font-extrabold tracking-tight lg:text-4xl">
              Membangun Web Modern
            </h1>
            <p class="text-muted-foreground">
              Ini adalah contoh tampilan teks dengan font yang Anda pilih. Warna tombol dan elemen aksen akan mengikuti warna utama.
            </p>
            <div class="flex gap-2">
              <Button :style="{ backgroundColor: form.theme_color, borderColor: form.theme_color }">Primary Action</Button>
              <Button variant="outline">Secondary</Button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="rounded-xl border bg-card text-card-foreground shadow-sm p-4">
              <div class="h-20 w-full bg-muted rounded-md mb-2 animate-pulse"></div>
              <div class="h-4 w-2/3 bg-muted rounded mb-1"></div>
            </div>
            <div class="rounded-xl border bg-card text-card-foreground shadow-sm p-4">
               <div class="h-20 w-full bg-muted rounded-md mb-2 animate-pulse"></div>
               <div class="h-4 w-3/4 bg-muted rounded mb-1"></div>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { CheckIcon, PaletteIcon } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import Spinner from '@/components/ui/spinner/Spinner.vue'

definePageMeta({ layout: 'admin' })

const { data: settings, refresh } = await useFetch('/api/settings')
const loading = ref(false)

const form = reactive({
  font_family: 'Inter',
  theme_color: '#000000',
  theme_radius: '0.5'
})

// Data Fonts (Google Fonts)
const fonts = [
  { label: 'Inter (Default)', value: 'Inter' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Poppins', value: 'Poppins' },
  { label: 'Merriweather', value: 'Merriweather' },
  { label: 'Space Mono', value: 'Space Mono' },
]

// Data Preset Colors
const colors = [
  { value: '#09090b' }, // Zinc (Default)
  { value: '#dc2626' }, // Red
  { value: '#2563eb' }, // Blue
  { value: '#16a34a' }, // Green
  { value: '#d946ef' }, // Fuchsia
  { value: '#f97316' }, // Orange
]

// Init Data
if (settings.value) {
  if (settings.value.font_family) form.font_family = settings.value.font_family
  if (settings.value.theme_color) form.theme_color = settings.value.theme_color
  if (settings.value.theme_radius) form.theme_radius = settings.value.theme_radius
}

// Handle Slider (Array to Single Value)
const radiusValue = computed({
  get: () => [parseFloat(form.theme_radius)],
  set: (val) => form.theme_radius = val[0].toString()
})

const saveSettings = async () => {
  loading.value = true
  try {
    await $fetch('/api/settings', { method: 'POST', body: form })
    toast.success('Tema diperbarui!')
    // Force reload window to apply global CSS vars cleanly if needed, 
    // but Nuxt reactive state handles it mostly.
    await refresh()
  } catch (err) {
    toast.error('Gagal menyimpan tema')
  } finally {
    loading.value = false
  }
}
</script>