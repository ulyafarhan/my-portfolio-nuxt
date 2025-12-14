<template>
  <div class="h-[calc(100vh-4rem)] flex flex-col bg-background text-foreground">
    
    <div v-if="!isMobileView || !selectedMessage" class="p-4 md:p-6 border-b bg-card flex items-center justify-between shrink-0">
      <div>
        <h1 class="text-2xl font-bold tracking-tight">Inbox</h1>
        <p class="text-sm text-muted-foreground hidden sm:block">Kelola pesan masuk dari klien potensial.</p>
      </div>
      <Badge variant="secondary" class="px-3 py-1">
        {{ unreadCount }} Pesan Baru
      </Badge>
    </div>

    <div class="flex-1 flex overflow-hidden">
      
      <div 
        v-if="!isMobileView || !selectedMessage"
        class="w-full md:w-1/3 lg:w-[400px] border-r bg-muted/10 flex flex-col"
      >
        <div class="p-4 border-b bg-background/50 backdrop-blur-sm sticky top-0 z-10">
          <div class="relative">
            <SearchIcon class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              v-model="search" 
              placeholder="Cari pengirim atau subjek..." 
              class="pl-9 bg-background" 
            />
          </div>
        </div>

        <ScrollArea class="flex-1">
          <div v-if="filteredMessages.length === 0" class="p-8 text-center text-muted-foreground text-sm flex flex-col items-center">
            <InboxIcon class="h-10 w-10 mb-2 opacity-20" />
            <p>Tidak ada pesan ditemukan.</p>
          </div>

          <div class="flex flex-col">
            <button
              v-for="msg in filteredMessages"
              :key="msg.id"
              @click="selectMessage(msg)"
              :class="[
                'flex flex-col items-start gap-2 p-4 text-left transition-all hover:bg-muted border-b last:border-0 relative',
                selectedMessage?.id === msg.id ? 'bg-muted border-l-4 border-l-primary pl-[13px]' : 'border-l-4 border-l-transparent',
                msg.status === 'UNREAD' ? 'bg-primary/5 font-medium' : ''
              ]"
            >
              <div class="flex w-full flex-col gap-1.5">
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-sm truncate pr-2">{{ msg.name }}</span>
                  <span class="text-[10px] text-muted-foreground shrink-0">{{ formatDate(msg.createdAt) }}</span>
                </div>
                <span class="text-xs font-medium truncate w-full">{{ msg.subject || 'No Subject' }}</span>
              </div>
              <div class="line-clamp-2 text-xs text-muted-foreground w-full">
                {{ msg.content }}
              </div>
              <div v-if="msg.status === 'UNREAD'" class="absolute right-4 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary" />
            </button>
          </div>
        </ScrollArea>
      </div>

      <div 
        v-if="!isMobileView || selectedMessage"
        class="flex-1 flex flex-col bg-background h-full w-full"
      >
        <div v-if="!selectedMessage" class="flex flex-1 items-center justify-center text-muted-foreground flex-col gap-4">
          <div class="p-6 rounded-full bg-muted/30">
            <MailIcon class="h-12 w-12 opacity-20" />
          </div>
          <p>Pilih pesan untuk membaca detailnya.</p>
        </div>

        <div v-else class="flex flex-col h-full animate-in fade-in duration-300">
          
          <div class="flex items-center justify-between border-b p-4 shrink-0 gap-2">
            <div class="flex items-center gap-2">
              <Button v-if="isMobileView" variant="ghost" size="icon" @click="selectedMessage = null" class="mr-1">
                <ArrowLeftIcon class="h-5 w-5" />
              </Button>
              
              <div class="flex gap-2">
                <Button variant="outline" size="sm" @click="markAsRead(selectedMessage)" :disabled="selectedMessage.status !== 'UNREAD'" class="hidden sm:flex">
                  <MailOpenIcon class="mr-2 h-4 w-4" /> 
                  {{ selectedMessage.status === 'UNREAD' ? 'Tandai Dibaca' : 'Sudah Dibaca' }}
                </Button>
                 <Button variant="ghost" size="icon" @click="markAsRead(selectedMessage)" :disabled="selectedMessage.status !== 'UNREAD'" class="sm:hidden" title="Mark Read">
                   <MailOpenIcon class="h-4 w-4" />
                </Button>

                <Button variant="outline" size="sm" as-child class="hidden sm:flex">
                  <a :href="`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`">
                    <ReplyIcon class="mr-2 h-4 w-4" /> Balas
                  </a>
                </Button>
                 <Button variant="ghost" size="icon" as-child class="sm:hidden" title="Reply">
                  <a :href="`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`">
                    <ReplyIcon class="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <Button variant="ghost" size="icon" class="text-destructive hover:bg-destructive/10 hover:text-destructive" @click="deleteMessage(selectedMessage.id)">
              <TrashIcon class="h-5 w-5" />
            </Button>
          </div>

          <ScrollArea class="flex-1">
            <div class="p-6 md:p-10 max-w-3xl mx-auto">
              <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                <Avatar class="h-12 w-12 border-2 border-background shadow-sm">
                  <AvatarFallback class="bg-primary/10 text-primary font-bold text-lg">
                    {{ selectedMessage.name.charAt(0).toUpperCase() }}
                  </AvatarFallback>
                </Avatar>
                
                <div class="flex-1 space-y-1">
                  <h3 class="font-bold text-lg">{{ selectedMessage.name }}</h3>
                  <div class="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground gap-1 sm:gap-3">
                    <a :href="`mailto:${selectedMessage.email}`" class="hover:text-primary transition-colors flex items-center gap-1">
                       &lt;{{ selectedMessage.email }}&gt;
                    </a>
                    <span class="hidden sm:inline text-muted-foreground/30">•</span>
                    <span>{{ new Date(selectedMessage.createdAt).toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' }) }}</span>
                  </div>
                </div>
              </div>
              
              <Separator class="my-6" />
              
              <h2 class="text-2xl font-bold mb-6 leading-tight">{{ selectedMessage.subject }}</h2>
              
              <div class="prose dark:prose-invert max-w-none text-sm md:text-base leading-relaxed whitespace-pre-wrap text-foreground/90">
                {{ selectedMessage.content }}
              </div>
            </div>
          </ScrollArea>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { useMediaQuery } from '@vueuse/core'
import { 
  MailIcon, MailOpenIcon, TrashIcon, ReplyIcon, 
  SearchIcon, ArrowLeftIcon, InboxIcon 
} from 'lucide-vue-next'

// UI Imports
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

definePageMeta({ layout: 'admin' })

// Data Fetching
const { data: messages, refresh } = await useFetch('/api/inbox', { key: 'admin-inbox' })

// State
const search = ref('')
const selectedMessage = ref<any>(null)
const isMobileView = useMediaQuery('(max-width: 768px)')

// Computed
const unreadCount = computed(() => messages.value?.filter((m: any) => m.status === 'UNREAD').length || 0)

const filteredMessages = computed(() => {
  if (!messages.value) return []
  let msgs = messages.value

  if (search.value) {
    const q = search.value.toLowerCase()
    msgs = msgs.filter((m: any) => 
      m.name.toLowerCase().includes(q) || 
      m.subject?.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q)
    )
  }
  return msgs
})

// Actions
const selectMessage = async (msg: any) => {
  selectedMessage.value = msg
  // Auto mark as read if opened
  if (msg.status === 'UNREAD') {
    await markAsRead(msg, true) // silent update
  }
}

const formatDate = (date: string) => {
  const d = new Date(date)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  
  if (isToday) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  
  // Jika tahun ini, tampilkan tanggal bulan. Jika tidak, tampilkan tahun juga
  const options: Intl.DateTimeFormatOptions = { 
    month: 'short', 
    day: 'numeric',
    year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  }
  return d.toLocaleDateString([], options)
}

const markAsRead = async (msg: any, silent = false) => {
  if (!msg) return
  
  // Optimistic UI Update
  const originalStatus = msg.status
  msg.status = 'READ'
  
  try {
    await $fetch(`/api/inbox/${msg.id}`, {
      method: 'PATCH',
      body: { status: 'READ' }
    })
    if (!silent) toast.success('Ditandai sudah dibaca')
    
    // Refresh background untuk sync counter
    refresh()
  } catch (e) { 
    msg.status = originalStatus // Revert
    if (!silent) toast.error('Gagal update status')
  }
}

const deleteMessage = async (id: string) => {
  if (!confirm('Hapus pesan ini permanen?')) return
  
  try {
    await $fetch(`/api/inbox/${id}`, { method: 'DELETE' })
    
    // Reset selection jika yang dihapus sedang dibuka
    if (selectedMessage.value?.id === id) {
      selectedMessage.value = null
    }
    
    toast.success('Pesan dihapus')
    await refresh()
  } catch (e) { 
    toast.error('Gagal menghapus pesan') 
  }
}
</script>