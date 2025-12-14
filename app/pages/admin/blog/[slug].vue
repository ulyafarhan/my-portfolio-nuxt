<script setup lang="ts">
const route = useRoute()
const { data: post } = await useFetch(`/api/blog/${route.params.slug}`)

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Artikel tidak ditemukan' })
}

// 1. Dynamic SEO Meta
useSeoMeta({
  title: post.value.title,
  ogTitle: post.value.title,
  description: post.value.excerpt,
  ogDescription: post.value.excerpt,
  ogImage: post.value.coverImage,
  twitterCard: 'summary_large_image',
  twitterImage: post.value.coverImage,
  articlePublishedTime: post.value.createdAt,
  author: 'Ulya Farhan'
})

// 2. JSON-LD Schema (Structured Data untuk Google)
useHead({
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.value.title,
        image: [post.value.coverImage],
        datePublished: post.value.createdAt,
        dateModified: post.value.updatedAt,
        author: [{
            '@type': 'Person',
            name: 'Ulya Farhan',
            url: 'https://ulyafarhan.com'
        }]
      })
    }
  ]
})
</script>

<template>
  <article class="container max-w-3xl py-10">
    <div class="mb-8 text-center">
      <Badge variant="secondary" class="mb-4">
        {{ new Date(post.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' }) }}
      </Badge>
      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 leading-tight">{{ post.title }}</h1>
      <img v-if="post.coverImage" :src="post.coverImage" class="rounded-2xl w-full aspect-video object-cover shadow-2xl" alt="Cover" />
    </div>
    
    <div class="prose prose-lg dark:prose-invert mx-auto" v-html="post.content"></div>
  </article>
</template>