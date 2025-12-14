<template>
  <div class="p-8 max-w-4xl mx-auto">
    <div class="mb-8">
      <h1 class="text-3xl font-bold tracking-tight">Social Links</h1>
      <p class="text-muted-foreground">Kelola tautan sosial media yang muncul di footer/kontak.</p>
    </div>

    <Card class="mb-8">
      <CardHeader>
        <CardTitle>Tambah Link Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form @submit.prevent="handleSubmit" class="flex gap-4 items-end">
          <div class="space-y-2 flex-1">
            <Label>Platform</Label>
            <Input v-model="form.platform" placeholder="GitHub, LinkedIn..." required />
          </div>
          <div class="space-y-2 flex-[2]">
            <Label>URL</Label>
            <Input v-model="form.url" placeholder="https://..." required />
          </div>
          <div class="space-y-2 w-24">
            <Label>Urutan</Label>
            <Input type="number" v-model="form.order" placeholder="0" />
          </div>
          <Button type="submit" :disabled="loading">Tambah</Button>
        </form>
      </CardContent>
    </Card>

    <div class="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Platform</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Urutan</TableHead>
            <TableHead class="text-right">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="link in links" :key="link.id">
            <TableCell class="font-medium">{{ link.platform }}</TableCell>
            <TableCell class="text-muted-foreground text-xs">{{ link.url }}</TableCell>
            <TableCell>{{ link.order }}</TableCell>
            <TableCell class="text-right">
              <Button variant="ghost" size="icon" @click="deleteLink(link.id)" class="text-destructive">
                <TrashIcon class="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { TrashIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

definePageMeta({ layout: 'admin' })

const { data: links, refresh } = await useFetch('/api/social-links')
const loading = ref(false)
const form = reactive({ platform: '', url: '', order: 0, iconKey: '' })

const handleSubmit = async () => {
  loading.value = true
  try {
    await $fetch('/api/social-links', { method: 'POST', body: form })
    toast.success('Link ditambahkan')
    form.platform = ''; form.url = ''; form.order = 0;
    await refresh()
  } catch (e) { toast.error('Gagal menambah link') }
  finally { loading.value = false }
}

const deleteLink = async (id: string) => {
  if(!confirm('Hapus link ini?')) return
  await $fetch(`/api/social-links/${id}`, { method: 'DELETE' })
  await refresh()
  toast.success('Link dihapus')
}
</script>