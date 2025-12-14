<template>
  <div class="min-h-screen bg-background text-foreground p-4 md:p-8 w-full space-y-8">
    
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p class="text-sm md:text-base text-muted-foreground">Rekaman jejak aktivitas sistem dan keamanan.</p>
      </div>
      <div class="flex items-center gap-2">
        <Button variant="outline" size="sm" @click="refreshData" :disabled="pending">
          <RefreshCwIcon :class="['h-4 w-4 mr-2', pending ? 'animate-spin' : '']" />
          Refresh
        </Button>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
      <div class="relative w-full sm:w-72">
        <SearchIcon class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          v-model="searchQuery" 
          placeholder="Cari aktivitas atau user..." 
          class="pl-9 bg-background" 
        />
      </div>
      <div class="text-xs text-muted-foreground">
        Menampilkan {{ filteredLogs.length }} aktivitas terbaru.
      </div>
    </div>

    <div class="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow class="bg-muted/50 hover:bg-muted/50 border-b">
              <TableHead class="w-[180px]">Waktu</TableHead>
              <TableHead class="w-[150px]">Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead class="hidden md:table-cell w-[150px]">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow v-for="log in filteredLogs" :key="log.id" class="group hover:bg-muted/30 transition-colors">
              <TableCell class="font-mono text-xs text-muted-foreground whitespace-nowrap">
                {{ new Date(log.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'medium' }) }}
              </TableCell>
              <TableCell>
                <Badge :variant="getBadgeVariant(log.action)" class="uppercase text-[10px] font-bold tracking-wider">
                  {{ log.action }}
                </Badge>
              </TableCell>
              <TableCell class="text-sm">
                <span class="line-clamp-2 md:line-clamp-1">{{ log.details }}</span>
              </TableCell>
               <TableCell class="hidden md:table-cell font-mono text-xs text-muted-foreground">
                <div class="flex items-center gap-1">
                  <GlobeIcon class="h-3 w-3" />
                  {{ log.ipAddress || 'Unknown' }}
                </div>
              </TableCell>
            </TableRow>

            <TableRow v-if="filteredLogs.length === 0">
              <TableCell colspan="4" class="h-40 text-center text-muted-foreground">
                <div class="flex flex-col items-center gap-2">
                  <ActivityIcon class="h-8 w-8 opacity-20" />
                  <p>Tidak ada aktivitas ditemukan.</p>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { 
  RefreshCwIcon, SearchIcon, ActivityIcon, GlobeIcon 
} from 'lucide-vue-next'

// UI Components
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

definePageMeta({ layout: 'admin' })

// Fetch Logs
const { data: logs, refresh, pending } = await useFetch('/api/logs', { key: 'admin-logs' })
const searchQuery = ref('')

// Filter Logic
const filteredLogs = computed(() => {
  if (!logs.value) return []
  if (!searchQuery.value) return logs.value
  
  const q = searchQuery.value.toLowerCase()
  return logs.value.filter((log: any) => 
    log.action.toLowerCase().includes(q) || 
    log.details.toLowerCase().includes(q) ||
    log.ipAddress?.toLowerCase().includes(q)
  )
})

// Visual Logic for Badges
const getBadgeVariant = (action: string) => {
  const a = action.toUpperCase()
  if (a.includes('DELETE') || a.includes('REMOVE')) return 'destructive'
  if (a.includes('UPDATE') || a.includes('EDIT')) return 'secondary' // atau custom 'warning' jika ada
  if (a.includes('CREATE') || a.includes('ADD') || a.includes('UPLOAD')) return 'default'
  if (a.includes('LOGIN')) return 'outline'
  return 'secondary'
}

const refreshData = async () => {
  await refresh()
}
</script>