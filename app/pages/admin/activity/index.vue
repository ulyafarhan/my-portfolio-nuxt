<template>
  <div class="p-8 max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">Audit Logs</h1>
      <p class="text-muted-foreground">Catatan aktivitas sistem dan keamanan.</p>
    </div>

    <div class="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Waktu</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Details</TableHead>
            <TableHead>IP Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="log in logs" :key="log.id">
            <TableCell class="font-mono text-xs text-muted-foreground">
              {{ new Date(log.createdAt).toLocaleString() }}
            </TableCell>
            <TableCell>
              <Badge variant="outline">{{ log.action }}</Badge>
            </TableCell>
            <TableCell class="text-sm">
              {{ log.details }}
            </TableCell>
             <TableCell class="font-mono text-xs">
              {{ log.ipAddress }}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

definePageMeta({ layout: 'admin' })

// Fetch Logs
const { data: logs } = await useFetch('/api/logs')
</script>