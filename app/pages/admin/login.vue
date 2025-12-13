<template>
  <div class="flex h-screen w-full items-center justify-center bg-gray-50">
    <div class="w-full max-w-md space-y-6 rounded-lg border bg-white p-8 shadow-sm">
      <div class="text-center">
        <h1 class="text-2xl font-bold tracking-tight">Admin Portal</h1>
        <p class="text-sm text-gray-500">Sign in to manage your portfolio</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-medium">Email</label>
          <input 
            v-model="email" 
            type="email" 
            class="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="admin@example.com"
            required
          />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium">Password</label>
          <input 
            v-model="password" 
            type="password" 
            class="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>
        
        <button 
          type="submit" 
          :disabled="loading"
          class="inline-flex h-10 w-full items-center justify-center rounded-md bg-black text-sm font-medium text-white transition-colors hover:bg-gray-900 disabled:opacity-50"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>

        <p v-if="errorMsg" class="text-center text-sm text-red-500">{{ errorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

// Redirect jika sudah login
watchEffect(() => {
  if (user.value) {
    router.push('/admin')
  }
})

const handleLogin = async () => {
  loading.value = true
  errorMsg.value = ''
  
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    })

    if (error) throw error
    // Redirect ditangani otomatis oleh module/watcher
  } catch (e: any) {
    errorMsg.value = e.message
  } finally {
    loading.value = false
  }
}
</script>