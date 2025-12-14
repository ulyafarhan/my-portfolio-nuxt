<script setup lang="ts">
// Definisi tipe data untuk Section
interface PageSection {
  id: string
  key: string
  component: string
  isVisible: boolean
  order: number
  content: any
}

// Fetch sections dari API
const { data: sections } = await useFetch<PageSection[]>('/api/sections', {
  transform: (data: any) => {
    if (!data) return []
    // Filter yang visible dan urutkan berdasarkan order
    return data
      .filter((s: PageSection) => s.isVisible)
      .sort((a: PageSection, b: PageSection) => a.order - b.order)
  }
})
</script>

<template>
  <div class="relative min-h-screen w-full bg-white dark:bg-black">
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
       <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 blur-[100px] animate-blob"></div>
    </div>

    <div v-if="sections && sections.length > 0">
      <component 
        v-for="section in sections" 
        :key="section.id"
        :is="section.component"
        :content="section.content"
      />
    </div>
    
    <div v-else class="flex h-screen items-center justify-center text-muted-foreground">
      <p>Loading content...</p>
    </div>
  </div>
</template>

<style scoped>
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
</style>