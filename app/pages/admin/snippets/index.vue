<template>
  <div class="p-8 max-w-6xl mx-auto h-[calc(100vh-4rem)] flex flex-col">
    <div class="mb-6 flex justify-between items-center">
      <h1 class="text-3xl font-bold">Code Snippets</h1>
      <Dialog>
        <DialogTrigger as-child><Button>+ New Snippet</Button></DialogTrigger>
        <DialogContent class="max-w-3xl">
          <DialogHeader><DialogTitle>Create Snippet</DialogTitle></DialogHeader>
          <div class="space-y-4 py-4">
            <Input v-model="form.title" placeholder="Snippet Title" />
            <Input v-model="form.language" placeholder="Language (js, vue, python)" />
            <div class="border rounded-md overflow-hidden">
              <Textarea v-model="form.code" class="font-mono bg-slate-950 text-green-400 min-h-[300px]" placeholder="// Paste code here..." />
            </div>
          </div>
          <DialogFooter><Button @click="save">Save Snippet</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-10">
      <Card v-for="item in snippets" :key="item.id" class="group hover:border-primary transition-colors">
        <CardHeader class="pb-2">
          <div class="flex justify-between">
             <CardTitle class="text-lg">{{ item.title }}</CardTitle>
             <Badge variant="secondary">{{ item.language }}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div class="bg-muted p-3 rounded-md font-mono text-xs overflow-hidden h-32 relative text-muted-foreground">
            <pre>{{ item.code }}</pre>
            <div class="absolute inset-0 bg-gradient-to-t from-muted to-transparent"></div>
          </div>
        </CardContent>
        <CardFooter class="pt-2 flex justify-end gap-2">
          <Button size="sm" variant="outline" @click="copy(item.code)">Copy</Button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'

definePageMeta({ layout: 'admin' })
const { data: snippets, refresh } = await useFetch('/api/snippets')
const form = reactive({ title: '', language: '', code: '' })

const save = async () => {
  await $fetch('/api/snippets', { method: 'POST', body: form })
  toast.success('Snippet Saved')
  await refresh()
  // Reset form logic here...
}

const copy = (code: string) => {
  navigator.clipboard.writeText(code)
  toast.success('Copied to clipboard')
}
</script>