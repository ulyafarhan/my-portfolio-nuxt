<template>
  <div class="p-8">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
      <p class="text-muted-foreground">Selamat datang di panel kontrol Admin.</p>
    </div>

    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      
      <NuxtLink to="/admin/projects" class="group block space-y-3 rounded-xl border bg-white p-6 shadow-sm transition hover:border-black hover:shadow-md">
        <div class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white group-hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
        </div>
        <h3 class="text-lg font-bold">Manage Projects</h3>
        <p class="text-sm text-gray-500">Tambah, edit, atau hapus portofolio project Anda.</p>
      </NuxtLink>

      <div class="block space-y-3 rounded-xl border bg-gray-50 p-6">
        <div class="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-400">Analytics</h3>
        <p class="text-sm text-gray-400">Coming Soon (Statistik pengunjung)</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  // Middleware Auth otomatis aktif (user wajib login)
})
</script>