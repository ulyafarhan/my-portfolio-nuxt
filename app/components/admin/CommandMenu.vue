<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Calculator, Calendar, CreditCard, Settings, User, 
  LayoutDashboard, FileText, Briefcase, Mail, 
  PlusCircle, Search, Laptop, Moon, Sun 
} from 'lucide-vue-next'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'

const open = ref(false)
const router = useRouter()
const colorMode = useColorMode()

// Shortcut Listener (Ctrl+K / Cmd+K)
onMounted(() => {
  const down = (e: KeyboardEvent) => {
    if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      open.value = !open.value
    }
  }
  document.addEventListener('keydown', down)
  onUnmounted(() => document.removeEventListener('keydown', down))
})

// Helper untuk navigasi dan tutup menu
const runCommand = (command: Function) => {
  command()
  open.value = false
}

// Daftar rute navigasi
const pages = [
  { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
  { title: 'Projects', url: '/admin/projects', icon: Briefcase },
  { title: 'Blog', url: '/admin/blog', icon: FileText },
  { title: 'Inbox', url: '/admin/inbox', icon: Mail },
  { title: 'Services', url: '/admin/services', icon: CreditCard },
  { title: 'Layout Builder', url: '/admin/layout', icon: Laptop },
  { title: 'Settings', url: '/admin/settings', icon: Settings },
]

// Daftar aksi cepat
const actions = [
  { title: 'Create New Project', action: () => router.push('/admin/projects?new=true'), icon: PlusCircle },
  { title: 'Create New Article', action: () => router.push('/admin/blog?new=true'), icon: PlusCircle },
  { title: 'Toggle Dark Mode', action: () => colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark', icon: Moon },
]
</script>

<template>
  <div class="hidden lg:block">
    <button 
      @click="open = true"
      class="inline-flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
      <span class="text-xs">Search...</span>
      <kbd class="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
        <span class="text-xs">⌘</span>K
      </kbd>
    </button>

    <CommandDialog :open="open" @update:open="open = $event">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          <CommandItem 
            v-for="page in pages" 
            :key="page.url"
            :value="page.title"
            @select="runCommand(() => router.push(page.url))"
          >
            <component :is="page.icon" class="mr-2 h-4 w-4" />
            <span>{{ page.title }}</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem 
            v-for="action in actions" 
            :key="action.title"
            :value="action.title"
            @select="runCommand(action.action)"
          >
            <component :is="action.icon" class="mr-2 h-4 w-4" />
            <span>{{ action.title }}</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="System">
           <CommandItem value="Logout" @select="runCommand(() => router.push('/login'))">
            <User class="mr-2 h-4 w-4" />
            <span>Logout</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  </div>
</template>