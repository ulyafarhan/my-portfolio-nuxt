<script setup lang="ts">
import { computed } from 'vue'
import { MapPinIcon, GlobeIcon, MailIcon, LinkedinIcon, GithubIcon, ExternalLinkIcon } from 'lucide-vue-next'

const props = defineProps<{
  data: {
    settings: any,
    experiences: any[],
    projects: any[],
    config: {
      showPhoto: boolean,
      showProjects: boolean,
      accentColor: string
    }
  }
}>()

// Helper: Convert Hex to RGB untuk membuat warna background transparan
const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '0,0,0'
}

const accentColorRgb = computed(() => hexToRgb(props.data.config.accentColor || '#000000'))
const cleanUrl = (url: string) => url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : ''

// Mengambil skill unik dari Tech Stack Project
const uniqueSkills = computed(() => {
  const allSkills = props.data.projects?.flatMap(p => p.techStack || []) || []
  return [...new Set(allSkills)].slice(0, 12) // Limit 12 skills
})
</script>

<template>
  <div 
    id="resume-a4"
    class="bg-white text-slate-800 leading-relaxed relative shadow-2xl print:shadow-none flex overflow-hidden font-sans"
    :style="{
      width: '210mm',
      height: '297mm', // Fixed height A4
      '--accent-color': data.config.accentColor || '#000',
      '--accent-bg': `rgba(${accentColorRgb}, 0.08)`,
      '--accent-light': `rgba(${accentColorRgb}, 0.15)`
    }"
  >
    <aside class="w-[32%] h-full flex flex-col pt-12 px-6 pb-8" :style="{ backgroundColor: 'var(--accent-bg)' }">
      
      <div v-if="data.config.showPhoto && data.settings.site_logo" class="mb-8 flex justify-center">
        <div class="relative w-32 h-32">
          <div class="absolute inset-0 rounded-full border-[3px]" :style="{ borderColor: 'var(--accent-color)' }"></div>
          <img 
            :src="data.settings.site_logo" 
            class="w-full h-full object-cover rounded-full border-4 border-white shadow-sm"
          />
        </div>
      </div>

      <div class="space-y-4 mb-8">
        <h3 class="uppercase tracking-widest text-xs font-bold border-b pb-2 mb-3 border-slate-300/50">Contact</h3>
        
        <div v-if="data.settings.contact_email" class="flex items-center gap-3 text-sm">
          <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-[var(--accent-color)]">
            <MailIcon class="w-3 h-3" />
          </div>
          <span class="break-all">{{ data.settings.contact_email }}</span>
        </div>

        <div v-if="data.settings.resume_url" class="flex items-center gap-3 text-sm">
          <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-[var(--accent-color)]">
            <GlobeIcon class="w-3 h-3" />
          </div>
          <a :href="data.settings.resume_url" target="_blank" class="hover:underline">{{ cleanUrl(data.settings.resume_url) }}</a>
        </div>

        <div class="flex items-center gap-3 text-sm">
          <div class="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-[var(--accent-color)]">
            <MapPinIcon class="w-3 h-3" />
          </div>
          <span>Indonesia</span>
        </div>
      </div>

      <div class="mb-8">
        <h3 class="uppercase tracking-widest text-xs font-bold border-b pb-2 mb-3 border-slate-300/50">Skills</h3>
        <div class="flex flex-wrap gap-2">
          <span 
            v-for="skill in uniqueSkills" 
            :key="skill"
            class="text-[10px] font-semibold px-2 py-1 rounded bg-white text-slate-700 shadow-sm"
          >
            {{ skill }}
          </span>
        </div>
      </div>

      <div class="mt-auto">
        <h3 class="uppercase tracking-widest text-xs font-bold border-b pb-2 mb-3 border-slate-300/50">Education</h3>
        <div class="mb-3">
          <p class="font-bold text-sm">Bachelor of Informatics</p>
          <p class="text-xs text-slate-600">Universitas Malikussaleh</p>
          <p class="text-[10px] text-slate-500 mt-0.5">2023 - Present</p>
        </div>
      </div>
    </aside>

    <main class="flex-1 py-12 px-8 flex flex-col h-full">
      
      <header class="mb-8">
        <h1 class="text-4xl font-extrabold uppercase tracking-tight text-slate-900 leading-none mb-2" :style="{ color: 'var(--accent-color)' }">
          {{ data.settings.site_name }}
        </h1>
        <p class="text-lg font-medium text-slate-500 tracking-wide">Fullstack Developer</p>
      </header>

      <section class="mb-8">
        <h2 class="text-sm font-bold uppercase tracking-widest mb-3 flex items-center gap-2 text-slate-800">
          <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: 'var(--accent-color)' }"></span> 
          Professional Summary
        </h2>
        <div class="text-sm text-slate-600 leading-relaxed text-justify" v-html="data.settings.bio_short"></div>
      </section>

      <section class="mb-8">
        <h2 class="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-800">
          <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: 'var(--accent-color)' }"></span> 
          Work Experience
        </h2>
        
        <div class="space-y-0 relative border-l-2 border-slate-100 ml-1.5 pl-6">
          <div v-for="exp in data.experiences" :key="exp.id" class="relative pb-6 last:pb-0 group">
            <div 
              class="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10"
              :style="{ backgroundColor: 'var(--accent-color)' }"
            ></div>

            <div class="flex justify-between items-start mb-1">
              <h3 class="font-bold text-slate-800">{{ exp.position }}</h3>
              <span class="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 whitespace-nowrap">
                {{ new Date(exp.startDate).getFullYear() }} - {{ exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present' }}
              </span>
            </div>
            
            <div class="text-xs font-semibold text-[var(--accent-color)] mb-2 uppercase tracking-wide">
              {{ exp.company }}
            </div>
            
            <p class="text-sm text-slate-600 leading-relaxed text-justify">
              {{ exp.description }}
            </p>
          </div>
        </div>
      </section>

      <section v-if="data.config.showProjects" class="flex-1">
        <h2 class="text-sm font-bold uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-800">
          <span class="w-1.5 h-1.5 rounded-full" :style="{ backgroundColor: 'var(--accent-color)' }"></span> 
          Selected Projects
        </h2>

        <div class="grid grid-cols-1 gap-4">
          <div 
            v-for="proj in data.projects.slice(0, 3)" 
            :key="proj.id" 
            class="bg-white border border-slate-100 rounded p-3 shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
          >
            <div class="flex justify-between items-start mb-1">
              <h4 class="font-bold text-sm text-slate-800">{{ proj.title }}</h4>
              <a v-if="proj.demoUrl" :href="proj.demoUrl" target="_blank" class="text-[10px] flex items-center gap-1 text-[var(--accent-color)] hover:underline">
                Live Demo <ExternalLinkIcon class="w-2.5 h-2.5" />
              </a>
            </div>
            <p class="text-xs text-slate-500 line-clamp-2 mb-2">{{ proj.description }}</p>
            <div class="flex flex-wrap gap-1">
              <span v-for="t in (proj.techStack || []).slice(0, 5)" :key="t" class="text-[9px] px-1.5 py-0.5 bg-slate-50 text-slate-600 rounded">
                {{ t }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
/* Pastikan font render bagus saat di print */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

#resume-a4 {
  font-family: 'Inter', sans-serif;
  /* Mencegah pemotongan elemen saat print */
  page-break-inside: avoid; 
}

@media print {
  @page {
    margin: 0;
    size: A4;
  }
  body {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  #resume-a4 {
    margin: 0;
    width: 210mm;
    height: 297mm;
    box-shadow: none;
    page-break-after: always;
  }
}
</style>