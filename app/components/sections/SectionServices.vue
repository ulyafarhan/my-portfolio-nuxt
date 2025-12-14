<script setup lang="ts">
import { CheckIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

const props = defineProps<{ content: { title?: string, subtitle?: string } }>()

// Fetch services (sorted by order)
const { data: services } = await useFetch('/api/services')
</script>

<template>
  <section class="container mx-auto px-6 py-20" id="services">
    <div class="text-center max-w-2xl mx-auto mb-16">
      <h2 class="text-3xl font-bold tracking-tight mb-4">{{ props.content.title || 'Services & Pricing' }}</h2>
      <p class="text-muted-foreground text-lg">{{ props.content.subtitle || 'Choose the best plan for your business needs.' }}</p>
    </div>

    <div v-if="services" class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      <Card 
        v-for="plan in services" 
        :key="plan.id" 
        class="flex flex-col relative transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border-2"
        :class="plan.isPopular ? 'border-primary shadow-md' : 'border-transparent shadow-sm'"
      >
        <div v-if="plan.isPopular" class="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold shadow-sm">
          MOST POPULAR
        </div>

        <CardHeader>
          <CardTitle class="text-xl">{{ plan.title }}</CardTitle>
          <CardDescription>{{ plan.description }}</CardDescription>
        </CardHeader>
        
        <CardContent class="flex-1">
          <div class="mb-6">
            <span class="text-3xl font-bold">{{ plan.price }}</span>
          </div>
          
          <ul class="space-y-3">
            <li v-for="(feature, i) in plan.features" :key="i" class="flex items-start gap-3 text-sm text-muted-foreground">
              <div class="mt-0.5 rounded-full bg-green-100 p-0.5 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                <CheckIcon class="w-3 h-3" />
              </div>
              {{ feature }}
            </li>
          </ul>
        </CardContent>

        <CardFooter>
          <Button 
            class="w-full" 
            :variant="plan.isPopular ? 'default' : 'outline'"
            as-child
          >
            <NuxtLink to="/#contact" :external="true">
              Choose Plan
            </NuxtLink>
          </Button>
        </CardFooter>
      </Card>
    </div>
  </section>
</template>