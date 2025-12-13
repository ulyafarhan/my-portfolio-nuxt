<template>
  <div class="relative min-h-screen w-full overflow-hidden bg-white dark:bg-black selection:bg-black selection:text-white">
    
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 blur-[100px] animate-blob"></div>
      <div class="absolute top-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-blue-400/20 blur-[100px] animate-blob animation-delay-2000"></div>
      <div class="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-pink-400/20 blur-[100px] animate-blob animation-delay-4000"></div>
    </div>

    <section class="container mx-auto px-6 pt-32 pb-20">
      <div class="max-w-4xl">
        <h1 class="text-6xl md:text-8xl font-black tracking-tighter text-black dark:text-white mb-6 leading-[0.9]">
          BLEEDING<br/>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">EDGE.</span>
        </h1>
        <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
          Fullstack Engineer crafting robust architectures with <span class="font-bold text-black dark:text-white">Nuxt 4</span>, 
          <span class="font-bold text-black dark:text-white">Supabase</span>, and 
          <span class="font-bold text-black dark:text-white">AI Agents</span>.
        </p>
        
        <div class="mt-10 flex gap-4">
          <NuxtLink to="/admin/projects" class="group relative px-8 py-3 rounded-full bg-black text-white font-medium overflow-hidden">
            <div class="absolute inset-0 w-full h-full bg-zinc-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <span class="relative">Explore Work</span>
          </NuxtLink>
          <button @click="openChat" class="px-8 py-3 rounded-full border border-gray-300 font-medium hover:bg-gray-50 transition-colors">
            Ask AI Assistant
          </button>
        </div>
      </div>
    </section>

    <section class="container mx-auto px-6 py-20">
      <div class="flex items-center justify-between mb-10">
        <h2 class="text-3xl font-bold tracking-tight">Selected Works</h2>
        <span class="text-sm font-mono text-gray-500">POWERED BY PRISMA 7</span>
      </div>

      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
        <div class="h-96 rounded-3xl bg-gray-200"></div>
        <div class="h-96 rounded-3xl bg-gray-200"></div>
      </div>

      <div v-else-if="error" class="p-4 rounded-lg bg-red-50 text-red-500">
        Gagal memuat data: {{ error.message }}
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          v-for="(project, i) in projects" 
          :key="project.id"
          :class="[
            'group relative overflow-hidden rounded-3xl border border-gray-100 bg-white/50 backdrop-blur-sm p-2 transition-all hover:shadow-2xl hover:shadow-black/5',
            i === 0 ? 'md:col-span-2 md:aspect-[2/1]' : 'md:aspect-square'
          ]"
        >
          <div class="relative h-full w-full overflow-hidden rounded-2xl bg-gray-100">
            <img 
              :src="project.thumbnail" 
              class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              alt="Project Thumbnail"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80"></div>
            
            <div class="absolute bottom-0 left-0 p-8 text-white">
              <div class="mb-2 flex flex-wrap gap-2">
                <span 
                  v-for="tech in (project.techStack || [])" 
                  :key="tech"
                  class="rounded-full bg-white/20 px-3 py-1 text-xs font-medium backdrop-blur-md"
                >
                  {{ tech }}
                </span>
              </div>
              <h3 class="text-3xl font-bold">{{ project.title }}</h3>
              <p class="mt-2 text-gray-200 line-clamp-2">{{ project.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
// Fetch Data langsung dari API Server (SSR Friendly)
const { data: projects, pending, error } = await useFetch('/api/portfolio', {
  lazy: true,
  server: true
})

// Interaksi dengan Chat Widget
const openChat = () => {
  const chatButton = document.querySelector('button[aria-label="Toggle Chat"]') as HTMLButtonElement
  if (!chatButton) {
    // Cari tombol terakhir di body (biasanya widget chat)
    const allButtons = document.querySelectorAll('button')
    allButtons[allButtons.length - 1]?.click() 
  } else {
    chatButton.click()
  }
}
</script>

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
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
</style>