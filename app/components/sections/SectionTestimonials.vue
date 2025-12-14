<script setup lang="ts">
import { StarIcon, QuoteIcon } from 'lucide-vue-next'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

const props = defineProps<{ content: { title?: string } }>()
const { data: testimonials } = await useFetch('/api/testimonials', {
  transform: (data) => data.filter(t => t.isShow) // Hanya tampilkan yang visible
})
</script>

<template>
  <section v-if="testimonials && testimonials.length > 0" class="py-20 bg-muted/10">
    <div class="container mx-auto px-6">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold tracking-tight mb-4">{{ props.content.title || 'Client Testimonials' }}</h2>
      </div>

      <div class="max-w-4xl mx-auto">
        <Carousel :opts="{ align: 'start', loop: true }" class="w-full">
          <CarouselContent>
            <CarouselItem 
              v-for="item in testimonials" 
              :key="item.id" 
              class="md:basis-1/2 lg:basis-1/3 p-2"
            >
              <Card class="h-full border-none shadow-md bg-background">
                <CardContent class="p-6 flex flex-col h-full">
                  <QuoteIcon class="w-8 h-8 text-primary/20 mb-4" />
                  <p class="text-muted-foreground italic mb-6 flex-1">"{{ item.content }}"</p>
                  
                  <div class="flex items-center gap-4 mt-auto">
                    <Avatar class="h-10 w-10 border">
                      <AvatarImage :src="item.avatarUrl || ''" />
                      <AvatarFallback>{{ item.clientName.charAt(0) }}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 class="font-semibold text-sm">{{ item.clientName }}</h4>
                      <p class="text-xs text-muted-foreground">{{ item.company }}</p>
                    </div>
                    <div class="ml-auto flex">
                      <StarIcon v-for="i in item.rating" :key="i" class="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious class="hidden sm:flex -left-12" />
          <CarouselNext class="hidden sm:flex -right-12" />
        </Carousel>
      </div>
    </div>
  </section>
</template>