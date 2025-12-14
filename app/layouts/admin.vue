<script setup lang="ts">
// 1. Imports Icon
import { 
  PaletteIcon, 
  LayoutDashboardIcon, 
  FolderIcon, 
  FileTextIcon, 
  SettingsIcon, 
  LogOutIcon, 
  BriefcaseIcon, 
  MessageSquareQuoteIcon, 
  InboxIcon,
  LayoutTemplateIcon,
  Share2Icon, 
  FileUserIcon,
  CreditCardIcon, // Ganti BillIcon jadi CreditCardIcon biar standar
  ImagesIcon,
  ShieldAlertIcon // Tambahan untuk Activity
} from 'lucide-vue-next'

// 2. Import Components
import CommandMenu from '@/components/admin/CommandMenu.vue'
import { Separator } from '@/components/ui/separator' // Wajib diimport
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
  SidebarRail
} from '@/components/ui/sidebar'

// 3. Logic Fetch Data
const { data: inboxStats } = await useFetch('/api/inbox', { 
  transform: (msgs: any[]) => msgs.filter(m => m.status === 'UNREAD').length,
  default: () => 0
})

const route = useRoute()
</script>

<template>
  <SidebarProvider>
    
    <Sidebar collapsible="icon">
      
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span class="font-bold text-lg">A</span>
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">Admin Panel</span>
                <span class="truncate text-xs">Portfolio Manager</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarMenu>
            
            <SidebarMenuItem>
              <SidebarMenuButton as-child tooltip="Dashboard" :isActive="route.path === '/admin'">
                <NuxtLink to="/admin">
                  <LayoutDashboardIcon />
                  <span>Dashboard</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton as-child tooltip="Inbox" :isActive="route.path.includes('/admin/inbox')">
                <NuxtLink to="/admin/inbox">
                  <InboxIcon />
                  <span>Inbox</span>
                </NuxtLink>
              </SidebarMenuButton>
              <SidebarMenuBadge v-if="inboxStats > 0" class="bg-red-500 text-white hover:bg-red-600">
                {{ inboxStats }}
              </SidebarMenuBadge>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton as-child tooltip="Projects" :isActive="route.path.includes('/admin/projects')">
                <NuxtLink to="/admin/projects">
                  <FolderIcon />
                  <span>Projects</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton as-child tooltip="Blog" :isActive="route.path.includes('/admin/blog')">
                <NuxtLink to="/admin/blog">
                  <FileTextIcon />
                  <span>Blog</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton as-child tooltip="Experience" :isActive="route.path.includes('/admin/experience')">
                <NuxtLink to="/admin/experience">
                  <BriefcaseIcon />
                  <span>Experience</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton as-child tooltip="Services" :isActive="route.path.includes('/admin/services')">
                <NuxtLink to="/admin/services">
                  <CreditCardIcon />
                  <span>Services</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton as-child tooltip="Testimonials" :isActive="route.path.includes('/admin/testimonials')">
                <NuxtLink to="/admin/testimonials">
                  <MessageSquareQuoteIcon />
                  <span>Testimonials</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools & Config</SidebarGroupLabel>
          <SidebarMenu>
             <SidebarMenuItem>
              <SidebarMenuButton as-child tooltip="Media Library" :isActive="route.path.includes('/admin/media')">
                <NuxtLink to="/admin/media">
                  <ImagesIcon />
                  <span>Media Library</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton as-child tooltip="Layout Builder" :isActive="route.path.includes('/admin/layout')">
                <NuxtLink to="/admin/layout">
                  <LayoutTemplateIcon />
                  <span>Layout Builder</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton as-child tooltip="Resume Builder" :isActive="route.path.includes('/admin/resume')">
                <NuxtLink to="/admin/resume">
                  <FileUserIcon />
                  <span>Resume Builder</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
            <SidebarMenuItem>
              <SidebarMenuButton as-child tooltip="Social Links" :isActive="route.path.includes('/admin/social-links')">
                <NuxtLink to="/admin/social-links">
                  <Share2Icon />
                  <span>Social Links</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            
             <SidebarMenuItem>
              <SidebarMenuButton as-child tooltip="Activity Logs" :isActive="route.path.includes('/admin/activity')">
                <NuxtLink to="/admin/activity">
                  <ShieldAlertIcon />
                  <span>Activity Logs</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton as-child tooltip="Settings" :isActive="route.path.includes('/admin/settings')">
                <NuxtLink to="/admin/settings">
                  <SettingsIcon />
                  <span>Settings</span>
                </NuxtLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton as-child tooltip="Back to Site">
              <NuxtLink to="/" target="_blank">
                <LogOutIcon />
                <span>Back to Site</span>
              </NuxtLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      
      <SidebarRail />
    </Sidebar>

    <SidebarInset>
      <header class="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
        <div class="flex items-center gap-2">
          <SidebarTrigger class="-ml-1" />
          <Separator orientation="vertical" class="mr-2 h-4" />
          <span class="text-sm font-medium hidden md:block">
             Admin / {{ route.name?.toString().split('-').pop() }}
          </span>
        </div>
        
        <div class="ml-auto flex items-center gap-2">
           <CommandMenu />
        </div>
      </header>

      <main class="flex flex-1 flex-col gap-4 p-4 pt-6">
        <slot />
      </main>
    </SidebarInset>

  </SidebarProvider>
</template>