<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div 
        v-if="isOpen"
        class="flex h-[500px] w-[350px] flex-col rounded-xl border bg-white shadow-2xl dark:bg-zinc-900"
      >
        <div class="flex items-center justify-between border-b p-4 bg-zinc-50 dark:bg-zinc-800 rounded-t-xl">
          <div class="flex items-center gap-2">
            <div class="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <span class="font-semibold text-sm">DevBot Assistant</span>
          </div>
          <button @click="isOpen = false" class="text-gray-500 hover:text-black dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>

        <div ref="scrollRef" class="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
          <div 
            v-for="(msg, idx) in messages" 
            :key="idx"
            :class="['flex w-full', msg.role === 'user' ? 'justify-end' : 'justify-start']"
          >
            <div 
              :class="[
                'max-w-[85%] rounded-lg px-4 py-2 text-sm leading-relaxed shadow-sm',
                msg.role === 'user' 
                  ? 'bg-black text-white dark:bg-white dark:text-black' 
                  : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100'
              ]"
            >
              {{ msg.content }}
              <span v-if="msg.role === 'assistant' && idx === messages.length - 1 && isLoading" class="inline-block w-1.5 h-4 ml-1 align-middle bg-zinc-400 animate-blink"></span>
            </div>
          </div>
        </div>

        <form @submit.prevent="submit" class="border-t p-3">
          <div class="flex gap-2">
            <input 
              v-model="input" 
              placeholder="Tanya skill / project..." 
              class="flex-1 rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-black dark:focus:ring-white"
              :disabled="isLoading"
            />
            <button 
              type="submit"
              :disabled="isLoading || !input.trim()"
              class="inline-flex items-center justify-center rounded-md bg-black px-3 text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-white dark:text-black"
            >
              <svg v-if="!isLoading" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>
              <svg v-else class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            </button>
          </div>
        </form>
      </div>
    </Transition>

    <button 
      @click="isOpen = !isOpen"
      class="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-xl transition-transform hover:scale-110 active:scale-95 dark:bg-white dark:text-black"
    >
      <svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>
    </button>
  </div>
</template>

<script setup lang="ts">
const isOpen = ref(false)
const input = ref('')
const scrollRef = ref<HTMLElement | null>(null)
const { messages, isLoading, sendMessage } = useChat()

// Auto Scroll ke bawah saat pesan bertambah
watch(messages.value, async () => {
  await nextTick()
  if (scrollRef.value) {
    scrollRef.value.scrollTop = scrollRef.value.scrollHeight
  }
}, { deep: true })

const submit = () => {
  if (!input.value.trim()) return
  sendMessage(input.value)
  input.value = ''
}
</script>

<style scoped>
.animate-blink {
  animation: blink 1s step-end infinite;
}
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>