<script setup lang="ts">
import { BriefcaseIcon, ClockIcon } from 'lucide-vue-next'

const props = defineProps<{ content: { title?: string } }>()
const { data: experiences } = await useFetch('/api/experience')

const formatDate = (dateString: string) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })
}
</script>

<template>
  <section class="container mx-auto px-6 py-20">
    <h2 class="text-3xl font-bold tracking-tight text-center mb-12">{{ props.content.title || 'My Career Journey' }}</h2>

    <div class="max-w-3xl mx-auto space-y-12">
      <div v-for="exp in experiences" :key="exp.id" class="flex relative pl-10">
        <div class="absolute left-0 flex flex-col items-center">
          <div class="w-3 h-3 rounded-full bg-primary ring-8 ring-background"></div>
          <div class="h-full w-px bg-border my-2"></div>
        </div>

        <div class="flex-1 pb-10">
          <div class="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <ClockIcon class="w-4 h-4" />
            <span>
              {{ formatDate(exp.startDate) }} - 
              <span v-if="exp.endDate">{{ formatDate(exp.endDate) }}</span>
              <span v-else class="font-semibold text-primary">Present</span>
            </span>
          </div>
          
          <h3 class="text-xl font-semibold mb-1">{{ exp.position }}</h3>
          <p class="text-lg text-primary">{{ exp.company }}</p>
          <p v-if="exp.location" class="text-sm italic text-muted-foreground">{{ exp.location }}</p>
          
          <p class="mt-4 text-base text-foreground">
            {{ exp.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>