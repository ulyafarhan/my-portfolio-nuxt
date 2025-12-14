<template>
  <div class="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
    <header class="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div class="container flex h-16 items-center justify-between">
        
        <div class="flex gap-6 md:gap-10">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <span class="inline-block font-bold text-xl tracking-tight">DevPort.v2</span>
          </NuxtLink>
          
          <nav class="hidden md:flex gap-6">
            <NuxtLink 
              v-for="link in links" 
              :key="link.to" 
              :to="link.to" 
              class="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary data-[active=true]:text-primary"
              active-class="text-primary font-semibold"
            >
              {{ link.label }}
            </NuxtLink>
          </nav>
        </div>

        <div class="flex items-center gap-4">
          <NuxtLink to="/admin" class="hidden md:block text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
            Admin Portal
          </NuxtLink>

          <Sheet>
            <SheetTrigger as-child>
              <Button variant="ghost" size="icon" class="md:hidden">
                <MenuIcon class="h-5 w-5" />
                <span class="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" class="pr-0">
              <SheetHeader class="px-6 text-left">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav class="flex flex-col gap-4 mt-8 px-6">
                <NuxtLink 
                  v-for="link in links" 
                  :key="link.to" 
                  :to="link.to" 
                  class="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                  active-class="text-primary font-semibold"
                >
                  {{ link.label }}
                </NuxtLink>
                <div class="h-px bg-border my-2"></div>
                <NuxtLink to="/admin" class="text-sm font-medium text-muted-foreground hover:text-primary">
                  Admin Dashboard
                </NuxtLink>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>

    <main class="container py-6 md:py-10">
      <slot />
    </main>

    <footer class="border-t py-6 md:py-8 bg-muted/20">
      <div class="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built by <span class="font-medium text-foreground">Ulya Farhan</span>.
        </p>
        
        <SocialIcons v-if="socialLinks" :links="socialLinks" />
      </div>
    </footer>

    <ClientOnly>
      <ChatWidget />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { MenuIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import SocialIcons from '~/components/public/SocialIcons.vue'

const links = [
  { label: 'Projects', to: '/projects' },
  { label: 'Blog', to: '/blog' },
  { label: 'About', to: '/about' }
]

const { data: socialLinks } = await useFetch('/api/social-links', { 
  key: 'footer-socials',
  lazy: true 
})
</script>