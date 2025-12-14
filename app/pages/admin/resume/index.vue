<template>
  <div class="flex flex-col h-[calc(100vh-4rem)] bg-muted/30">
    <header class="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 lg:px-6 z-20 sticky top-0">
      <div class="flex items-center gap-2">
        <Sheet>
          <SheetTrigger as-child>
            <Button variant="outline" size="icon" class="lg:hidden mr-2">
              <Settings2Icon class="w-4 h-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" class="w-[300px] sm:w-[400px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Configuration</SheetTitle>
              <SheetDescription>Customize your resume layout.</SheetDescription>
            </SheetHeader>
            <div class="py-6">
              <ConfigPanel :config="config" :colors="colors" />
            </div>
          </SheetContent>
        </Sheet>

        <h1 class="text-lg font-semibold tracking-tight hidden sm:block">Resume Builder</h1>
        <Badge variant="secondary" class="hidden sm:flex">A4 Layout</Badge>
      </div>

      <div class="flex items-center gap-2">
        <div class="hidden md:flex items-center gap-1 bg-muted rounded-md p-1 mr-2">
          <Button variant="ghost" size="icon-xs" @click="zoomOut" :disabled="scale <= 0.4" class="h-7 w-7">
            <MinusIcon class="w-3 h-3" />
          </Button>
          <span class="text-xs font-mono w-12 text-center">{{ Math.round(scale * 100) }}%</span>
          <Button variant="ghost" size="icon-xs" @click="zoomIn" :disabled="scale >= 1.5" class="h-7 w-7">
            <PlusIcon class="w-3 h-3" />
          </Button>
        </div>

        <Button variant="outline" size="sm" @click="refresh" :disabled="pending">
          <RefreshCcwIcon class="w-3.5 h-3.5 mr-2" :class="{ 'animate-spin': pending }" />
          <span class="hidden sm:inline">Refresh</span>
        </Button>
        <Button size="sm" @click="handlePrint">
          <PrinterIcon class="w-3.5 h-3.5 mr-2" />
          Print / PDF
        </Button>
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <aside class="hidden lg:block w-80 border-r bg-background overflow-y-auto p-6 scrollbar-thin">
        <div class="mb-6">
          <h3 class="font-semibold mb-1">Settings</h3>
          <p class="text-xs text-muted-foreground">Real-time customization.</p>
        </div>
        <ConfigPanel :config="config" :colors="colors" />
        
        <Separator class="my-6" />
        
        <div class="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-4 border border-blue-100 dark:border-blue-900">
          <h4 class="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1 flex items-center gap-2">
            <InfoIcon class="w-3 h-3" /> Data Source
          </h4>
          <p class="text-[10px] text-blue-600 dark:text-blue-400 leading-relaxed">
            Resume ini mengambil data otomatis dari module <b>Settings</b>, <b>Experience</b>, dan <b>Projects</b>. Update data di sana untuk mengubah konten.
          </p>
        </div>
      </aside>

      <main class="flex-1 overflow-hidden relative bg-slate-100 dark:bg-zinc-950/50">
        <div class="absolute inset-0 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

        <div class="h-full w-full overflow-auto flex justify-center p-8 md:p-12">
          
          <div 
            class="transition-transform duration-200 ease-out origin-top shadow-2xl print:shadow-none print:transform-none print:m-0"
            :style="{ transform: `scale(${scale})` }"
          >
            <ClientOnly>
               <ResumeTemplate 
                v-if="resumeData" 
                :data="{ ...resumeData, config }" 
              />
              <div v-else class="flex items-center justify-center h-[297mm] w-[210mm] bg-white">
                <Spinner />
              </div>
            </ClientOnly>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  PrinterIcon, RefreshCcwIcon, Settings2Icon, 
  MinusIcon, PlusIcon, InfoIcon 
} from 'lucide-vue-next'

// UI Components
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet'
import Spinner from '@/components/ui/spinner/Spinner.vue' // Pastikan path benar

// Business Components
import ResumeTemplate from '@/components/resume/ResumeTemplate.vue'
import ConfigPanel from '@/components/resume/ConfigPanel.vue' // Kita pisah biar rapi

definePageMeta({ layout: 'admin' })

// State
const scale = ref(0.75) // Default zoom agar pas di laptop
const config = reactive({
  showPhoto: true,
  showProjects: true,
  accentColor: '#000000'
})

const colors = ['#000000', '#2563eb', '#dc2626', '#16a34a', '#7c3aed', '#f59e0b']

// Async Data
const { data: resumeData, refresh, pending } = await useAsyncData('resume-data', async () => {
  const [settings, experiences, projects] = await Promise.all([
    $fetch('/api/settings'),
    $fetch('/api/experience'),
    $fetch('/api/portfolio')
  ])
  return { settings, experiences, projects }
})

// Actions
const zoomIn = () => scale.value = Math.min(scale.value + 0.1, 1.5)
const zoomOut = () => scale.value = Math.max(scale.value - 0.1, 0.3)

// Responsiveness: Auto zoom based on screen width
onMounted(() => {
  if (window.innerWidth < 768) {
    scale.value = 0.45 // Mobile view
  } else if (window.innerWidth < 1280) {
    scale.value = 0.65 // Laptop view
  }
})

const handlePrint = () => {
  const style = document.createElement('style')
  style.innerHTML = `
    @media print {
      body * { visibility: hidden; }
      #resume-a4, #resume-a4 * { visibility: visible; }
      #resume-a4 { position: absolute; left: 0; top: 0; width: 210mm; min-height: 297mm; margin: 0; padding: 0; box-shadow: none; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      @page { size: A4; margin: 0; }
    }
  `
  document.head.appendChild(style)
  window.print()
  document.head.removeChild(style)
}
</script>