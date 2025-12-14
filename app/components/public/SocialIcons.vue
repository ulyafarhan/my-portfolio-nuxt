<script setup lang="ts">
import { 
  GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon, 
  YoutubeIcon, FacebookIcon, GlobeIcon, MailIcon 
} from 'lucide-vue-next'

const props = defineProps<{
  links: Array<{
    id: string
    platform: string
    url: string
    iconKey?: string
  }>
}>()

// Mapping icon string ke komponen
const iconMap: Record<string, any> = {
  'github': GithubIcon,
  'linkedin': LinkedinIcon,
  'twitter': TwitterIcon,
  'x': TwitterIcon,
  'instagram': InstagramIcon,
  'youtube': YoutubeIcon,
  'facebook': FacebookIcon,
  'email': MailIcon,
  'default': GlobeIcon
}

const getIcon = (key: string) => {
  const normalized = key?.toLowerCase() || 'default'
  return iconMap[normalized] || iconMap['default']
}
</script>

<template>
  <div class="flex items-center gap-4">
    <a 
      v-for="link in links" 
      :key="link.id" 
      :href="link.url" 
      target="_blank" 
      rel="noopener noreferrer"
      class="text-muted-foreground transition-colors hover:text-foreground hover:scale-110"
      :title="link.platform"
    >
      <component :is="getIcon(link.platform)" class="h-5 w-5" />
    </a>
  </div>
</template>