<script setup lang="ts">
import { ExternalLinkIcon, GitBranchIcon } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'

const props = defineProps<{ content: { title?: string } }>()

// Fetch project data (cached by Nitro)
const { data: projects, pending, error } = await useFetch('/api/portfolio')
</script>

<template>
  <section class="container mx-auto px-6 py-20">
    <div class="flex items-center justify-between mb-10">
      <h2 class="text-3xl font-bold tracking-tight">{{ props.content.title || 'My Projects' }}</h2>
      <NuxtLink to="/projects" class="text-sm text-primary hover:underline">View All</NuxtLink>
    </div>

    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
      <div class="h-64 rounded-xl bg-muted/50" v-for="i in 4" :key="i"></div>
    </div>

    <div v-else-if="error" class="p-4 rounded-lg bg-destructive/10 text-destructive">
      Gagal memuat data proyek: {{ error.message }}
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div 
        v-for="project in projects" 
        :key="project.id"
        class="group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-lg"
      >
        <div class="relative h-64 w-full overflow-hidden bg-muted">
          <img 
            :src="project.thumbnail || 'https://placehold.co/600x400/94a3b8/e2e8f0?text=No+Image'" 
            class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            :alt="project.title"
          />
        </div>
        
        <div class="p-4 space-y-2">
          <h3 class="text-xl font-semibold">{{ project.title }}</h3>
          <p class="text-sm text-muted-foreground line-clamp-2">{{ project.description }}</p>
          
          <div class="flex flex-wrap gap-2 pt-2">
            <Badge v-for="tech in (project.techStack || []).slice(0, 3)" :key="tech" variant="secondary" class="text-xs">
              {{ tech }}
            </Badge>
          </div>
          
          <div class="flex gap-3 pt-4 border-t mt-4">
            <a v-if="project.demoUrl" :href="project.demoUrl" target="_blank" class="text-sm text-primary hover:underline flex items-center gap-1">
              Live Demo <ExternalLinkIcon class="w-3 h-3" />
            </a>
             <a v-if="project.repoUrl" :href="project.repoUrl" target="_blank" class="text-sm text-muted-foreground hover:text-primary flex items-center gap-1">
              Repository <GitBranchIcon class="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>