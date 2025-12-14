
<template>
  <div class="flex min-h-screen flex-col bg-background md:flex-row">
    <aside class="w-full border-r bg-gray-50/50 p-6 md:w-64">
      <div class="mb-8 flex items-center gap-2 font-bold text-xl">
        <span>Admin Panel</span>
      </div>
      <nav class="space-y-2">
        <NuxtLink to="/admin" class="block rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200">
          Dashboard
        </NuxtLink>
        <NuxtLink to="/admin/projects" class="block rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-200">
          Projects
        </NuxtLink>
        <NuxtLink to="/" class="block rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:text-black mt-8 border-t pt-4">
          ← Back to Site
        </NuxtLink>
      </nav>
    </aside>

    

    <main class="flex-1 bg-white">
      <slot />
    </main>
  </div>
</template>
<script setup lang="ts">
import CommandMenu from '@/components/admin/CommandMenu.vue'
</script>