<template>
  <div class="p-6 max-w-7xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Inbox</h1>
        <p class="text-muted-foreground">Kelola pesan masuk dari klien potensial.</p>
      </div>
      <Badge variant="outline" class="px-3 py-1">
        {{ unreadCount }} Pesan Baru
      </Badge>
    </div>

    <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden rounded-xl border bg-card shadow-sm">
      
      <div class="md:col-span-1 border-r flex flex-col bg-muted/10">
        <div class="p-4 border-b">
          <Input v-model="search" placeholder="Cari pengirim..." class="bg-white" />
        </div>
        <ScrollArea class="flex-1">
          <div class="flex flex-col">
            <button
              v-for="msg in filteredMessages"
              :key="msg.id"
              @click="selectMessage(msg)"
              :class="[
                'flex flex-col items-start gap-2 p-4 text-left transition-all hover:bg-accent border-b last:border-0',
                selectedMessage?.id === msg.id ? 'bg-accent' : '',
                msg.status === 'UNREAD' ? 'bg-blue-50/50 dark:bg-blue-900/10 font-medium' : ''
              ]"
            >
              <div class="flex w-full flex-col gap-1">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="font-semibold text-sm">{{ msg.name }}</span>
                    <span v-if="msg.status === 'UNREAD'" class="flex h-2 w-2 rounded-full bg-blue-600" />
                  </div>
                  <span class="text-xs text-muted-foreground">{{ formatDate(msg.createdAt) }}</span>
                </div>
                <span class="text-xs font-medium">{{ msg.subject }}</span>
              </div>
              <div class="line-clamp-2 text-xs text-muted-foreground">
                {{ msg.content }}
              </div>
            </button>

            <div v-if="filteredMessages.length === 0" class="p-8 text-center text-muted-foreground text-sm">
              Tidak ada pesan ditemukan.
            </div>
          </div>
        </ScrollArea>
      </div>

      <div class="md:col-span-2 flex flex-col h-full bg-white dark:bg-zinc-950">
        <div v-if="selectedMessage" class="flex flex-col h-full">
          <div class="flex items-center justify-between border-b p-4">
            <div class="flex items-center gap-2">
              <Button variant="outline" size="sm" @click="markAsRead(selectedMessage)" :disabled="selectedMessage.status !== 'UNREAD'">
                <MailOpenIcon class="mr-2 h-4 w-4" /> 
                {{ selectedMessage.status === 'UNREAD' ? 'Tandai Dibaca' : 'Sudah Dibaca' }}
              </Button>
              <Button variant="outline" size="sm" as-child>
                <a :href="`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`">
                  <ReplyIcon class="mr-2 h-4 w-4" /> Balas
                </a>
              </Button>
            </div>
            <div class="flex items-center gap-2">
               <Button variant="ghost" size="icon" class="text-destructive hover:bg-destructive/10" @click="deleteMessage(selectedMessage.id)">
                <TrashIcon class="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea class="flex-1 p-8">
            <div class="flex items-center gap-4 mb-6">
              <Avatar class="h-12 w-12">
                <AvatarFallback>{{ selectedMessage.name.charAt(0) }}</AvatarFallback>
              </Avatar>
              <div class="grid gap-1">
                <div class="font-semibold">{{ selectedMessage.name }}</div>
                <div class="text-xs text-muted-foreground">{{ selectedMessage.email }}</div>
              </div>
              <div class="ml-auto text-xs text-muted-foreground">
                {{ new Date(selectedMessage.createdAt).toLocaleString() }}
              </div>
            </div>
            
            <Separator class="my-4" />
            
            <h2 class="text-xl font-bold mb-4">{{ selectedMessage.subject }}</h2>
            <div class="text-sm leading-relaxed whitespace-pre-wrap">
              {{ selectedMessage.content }}
            </div>
          </ScrollArea>
        </div>

        <div v-else class="flex flex-1 items-center justify-center text-muted-foreground">
          <div class="text-center">
            <MailIcon class="mx-auto h-12 w-12 opacity-20 mb-2" />
            <p>Pilih pesan untuk membaca detailnya.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { MailIcon, MailOpenIcon, TrashIcon, ReplyIcon } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

definePageMeta({ layout: 'admin' })

const { data: messages, refresh } = await useFetch('/api/inbox')
const search = ref('')
const selectedMessage = ref<any>(null)

const unreadCount = computed(() => messages.value?.filter((m: any) => m.status === 'UNREAD').length || 0)

const filteredMessages = computed(() => {
  if (!messages.value) return []
  if (!search.value) return messages.value
  const q = search.value.toLowerCase()
  return messages.value.filter((m: any) => 
    m.name.toLowerCase().includes(q) || 
    m.subject?.toLowerCase().includes(q) ||
    m.email.toLowerCase().includes(q)
  )
})

const selectMessage = async (msg: any) => {
  selectedMessage.value = msg
  if (msg.status === 'UNREAD') {
    await markAsRead(msg)
  }
}

const formatDate = (date: string) => {
  const d = new Date(date)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

const markAsRead = async (msg: any) => {
  try {
    // Optimistic UI update
    msg.status = 'READ'
    await $fetch(`/api/inbox/${msg.id}`, {
      method: 'PATCH',
      body: { status: 'READ' }
    })
    // Refresh background untuk sinkronisasi count
    refresh()
  } catch (e) { console.error(e) }
}

const deleteMessage = async (id: string) => {
  if (!confirm('Hapus pesan ini?')) return
  try {
    await $fetch(`/api/inbox/${id}`, { method: 'DELETE' })
    selectedMessage.value = null
    toast.success('Pesan dihapus')
    await refresh()
  } catch (e) { toast.error('Gagal menghapus') }
}
</script>