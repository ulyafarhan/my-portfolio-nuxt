<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
// Import Lowlight untuk Syntax Highlighting
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'

import { 
  Bold, Italic, List, ListOrdered, Quote, Undo, Redo, 
  Code, Link as LinkIcon, Image as ImageIcon 
} from 'lucide-vue-next'

import { Toggle } from '@/components/ui/toggle'

const props = defineProps<{ modelValue: string }>()
const emit = defineEmits(['update:modelValue'])

// 1. Inisialisasi Lowlight
const lowlight = createLowlight(common)

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      // 2. Wajib disable codeBlock bawaan agar tidak bentrok dengan CodeBlockLowlight
      codeBlock: false,
      heading: { levels: [2, 3] }
    }),
    Link.configure({ openOnClick: false }),
    Image,
    Placeholder.configure({ placeholder: 'Mulai menulis cerita inspiratif...' }),
    // 3. Konfigurasi Code Block Lowlight
    CodeBlockLowlight.configure({
      lowlight,
    })
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose-base dark:prose-invert focus:outline-none max-w-none min-h-[300px] px-4 py-3'
    }
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  }
})

watch(() => props.modelValue, (newVal) => {
  if (editor.value && newVal !== editor.value.getHTML()) {
    editor.value.commands.setContent(newVal, false)
  }
})

onBeforeUnmount(() => editor.value?.destroy())

const setLink = () => {
  const previousUrl = editor.value?.getAttributes('link').href
  const url = window.prompt('URL', previousUrl)
  if (url === null) return
  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }
  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
}

const addImage = () => {
  const url = window.prompt('URL Gambar')
  if (url) editor.value?.chain().focus().setImage({ src: url }).run()
}
</script>

<template>
  <div class="border rounded-md bg-background w-full flex flex-col overflow-hidden focus-within:ring-2 focus-within:ring-ring">
    <div v-if="editor" class="flex flex-wrap items-center gap-1 border-b bg-muted/40 p-1 sticky top-0 z-10">
      <Toggle size="sm" :pressed="editor.isActive('bold')" @click="editor.chain().focus().toggleBold().run()">
        <Bold class="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" :pressed="editor.isActive('italic')" @click="editor.chain().focus().toggleItalic().run()">
        <Italic class="h-4 w-4" />
      </Toggle>

      <div class="w-px h-4 bg-border mx-1"></div>

      <Toggle size="sm" :pressed="editor.isActive('heading', { level: 2 })" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
        <span class="font-bold text-xs">H2</span>
      </Toggle>
      <Toggle size="sm" :pressed="editor.isActive('heading', { level: 3 })" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">
        <span class="font-bold text-xs">H3</span>
      </Toggle>

      <div class="w-px h-4 bg-border mx-1"></div>

      <Toggle size="sm" :pressed="editor.isActive('bulletList')" @click="editor.chain().focus().toggleBulletList().run()">
        <List class="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" :pressed="editor.isActive('orderedList')" @click="editor.chain().focus().toggleOrderedList().run()">
        <ListOrdered class="h-4 w-4" />
      </Toggle>

      <div class="w-px h-4 bg-border mx-1"></div>

      <Toggle size="sm" :pressed="editor.isActive('blockquote')" @click="editor.chain().focus().toggleBlockquote().run()">
        <Quote class="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" :pressed="editor.isActive('codeBlock')" @click="editor.chain().focus().toggleCodeBlock().run()">
        <Code class="h-4 w-4" />
      </Toggle>

      <div class="w-px h-4 bg-border mx-1"></div>

      <Toggle size="sm" @click="addImage">
        <ImageIcon class="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" :pressed="editor.isActive('link')" @click="setLink">
        <LinkIcon class="h-4 w-4" />
      </Toggle>

      <div class="flex-1"></div>

      <Toggle size="sm" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()">
        <Undo class="h-4 w-4" />
      </Toggle>
      <Toggle size="sm" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()">
        <Redo class="h-4 w-4" />
      </Toggle>
    </div>

    <EditorContent :editor="editor" class="flex-1 cursor-text" />
  </div>
</template>

<style scoped>
/* Reset Prose margins */
:deep(.prose) {
  margin-top: 0;
  margin-bottom: 0;
}
:deep(.prose p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  color: #adb5bd;
  float: left;
  height: 0;
  pointer-events: none;
}

/* PENTING: Gunakan :deep() agar style bisa menembus ke elemen 
   yang digenerate oleh Tiptap/Lowlight 
*/

:deep(.ProseMirror pre) {
  background: #0d0d0d;
  color: #fff;
  font-family: 'JetBrains Mono', monospace;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

:deep(.ProseMirror pre code) {
  color: inherit;
  padding: 0;
  background: none;
  font-size: 0.8rem;
}

/* Warna Syntax Highlighting (Tema Atom One Dark) */
/* Semua class .hljs harus dibungkus :deep() */
:deep(.hljs-comment), :deep(.hljs-quote) { color: #5c6370; font-style: italic; }
:deep(.hljs-doctag), :deep(.hljs-keyword), :deep(.hljs-formula) { color: #c678dd; }
:deep(.hljs-section), :deep(.hljs-name), :deep(.hljs-selector-tag), :deep(.hljs-deletion), :deep(.hljs-subst) { color: #e06c75; }
:deep(.hljs-literal) { color: #56b6c2; }
:deep(.hljs-string), :deep(.hljs-regexp), :deep(.hljs-addition), :deep(.hljs-attribute), :deep(.hljs-meta .hljs-string) { color: #98c379; }
:deep(.hljs-attr), :deep(.hljs-variable), :deep(.hljs-template-variable), :deep(.hljs-type), :deep(.hljs-selector-class), :deep(.hljs-selector-attr), :deep(.hljs-selector-pseudo), :deep(.hljs-number) { color: #d19a66; }
:deep(.hljs-symbol), :deep(.hljs-bullet), :deep(.hljs-link), :deep(.hljs-meta), :deep(.hljs-selector-id), :deep(.hljs-title) { color: #61aeee; }
:deep(.hljs-built_in), :deep(.hljs-title.class_), :deep(.hljs-class .hljs-title) { color: #e6c07b; }
</style>