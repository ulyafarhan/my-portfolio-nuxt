<script setup lang="ts">
import { MailIcon } from 'lucide-vue-next'
// Asumsi ContactForm sudah Anda buat di components/public/ContactForm.vue
import ContactForm from '~/components/public/ContactForm.vue'

const props = defineProps<{ content: { title?: string, email?: string } }>()

// Fetch social links untuk ditampilkan di sini juga
const { data: socialLinks } = await useFetch('/api/social-links')
</script>

<template>
  <section class="container mx-auto px-6 py-20 bg-primary/5 dark:bg-zinc-900/50 rounded-xl my-16">
    <div class="max-w-4xl mx-auto grid gap-12 md:grid-cols-2">
      
      <div class="space-y-6">
        <h2 class="text-3xl font-bold tracking-tight">{{ props.content.title || 'Get In Touch' }}</h2>
        <p class="text-lg text-muted-foreground">
          Tertarik berkolaborasi dalam proyek baru atau sekadar ingin menyapa? Kirimkan pesan melalui formulir di samping atau hubungi saya langsung.
        </p>

        <div class="flex items-center gap-3 text-sm">
          <MailIcon class="w-5 h-5 text-primary" />
          <a :href="`mailto:${props.content.email}`" class="hover:underline">
            {{ props.content.email || 'your.email@example.com' }}
          </a>
        </div>
        
        <div v-if="socialLinks" class="pt-4">
            <h3 class="font-semibold mb-3">Find Me</h3>
            <SocialIcons :links="socialLinks" />
        </div>
      </div>
      
      <div>
        <ContactForm />
      </div>
    </div>
  </section>
</template>