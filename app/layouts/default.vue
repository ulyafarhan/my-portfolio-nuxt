<template>
  <div class="min-h-screen bg-background text-foreground font-sans antialiased selection:bg-primary selection:text-primary-foreground">
    <header class="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div class="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div class="flex gap-6 md:gap-10">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <span class="inline-block font-bold">DevPort.v2</span>
          </NuxtLink>
          <nav class="flex gap-6">
            <NuxtLink to="/projects" class="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
              Projects
            </NuxtLink>
            <NuxtLink to="/blog" class="flex items-center text-sm font-medium text-muted-foreground hover:text-foreground">
              Blog
            </NuxtLink>
          </nav>
        </div>
        <div class="flex flex-1 items-center justify-end space-x-4">
           <NuxtLink to="/admin" class="text-xs text-muted-foreground">Admin</NuxtLink>
        </div>
      </div>
    </header>

    <main class="container py-6 md:py-10">
      <slot />
    </main>

    <footer class="border-t py-6 md:py-0">
      <div class="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p class="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with Nuxt 4 & Bleeding Edge Tech.
        </p>
      </div>
    </footer>

    <ClientOnly>
      <ChatWidget />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import ChatWidget from '~/components/public/ChatWidget.vue'
</script>