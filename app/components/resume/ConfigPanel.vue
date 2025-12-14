<template>
  <div class="space-y-6">
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div class="space-y-0.5">
          <Label class="text-base">Profile Photo</Label>
          <p class="text-xs text-muted-foreground">Show logo/photo from settings.</p>
        </div>
        <Switch :checked="config.showPhoto" @update:checked="(v) => config.showPhoto = v" />
      </div>
      
      <Separator />

      <div class="flex items-center justify-between">
        <div class="space-y-0.5">
          <Label class="text-base">Featured Projects</Label>
          <p class="text-xs text-muted-foreground">Include top 3 projects.</p>
        </div>
        <Switch :checked="config.showProjects" @update:checked="(v) => config.showProjects = v" />
      </div>
    </div>

    <Separator />

    <div class="space-y-3">
      <Label class="text-base">Accent Color</Label>
      <div class="grid grid-cols-6 gap-2">
        <button 
          v-for="c in colors" 
          :key="c"
          @click="config.accentColor = c"
          class="w-8 h-8 rounded-full border shadow-sm transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          :class="config.accentColor === c ? 'ring-2 ring-ring ring-offset-2 scale-110' : 'hover:ring-1 ring-black/20'"
          :style="{ backgroundColor: c }"
          :aria-label="c"
        >
          <span v-if="config.accentColor === c" class="flex justify-center items-center h-full w-full">
            <svg class="w-4 h-4 text-white mix-blend-difference" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

defineProps<{
  config: any,
  colors: string[]
}>()
</script>