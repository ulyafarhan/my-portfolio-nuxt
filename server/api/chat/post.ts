import { defineEventHandler, readBody, createError, sendStream } from 'h3'

// System Prompt: Otak dari AI Anda
const SYSTEM_PROMPT = `
You are the AI Assistant for Ulya Farhan's Professional Portfolio.
Your name is "DevBot".
Tone: Professional, concise, slightly witty, and technical.
Context: Ulya is a Fullstack Developer expert in Nuxt, Vue, and Bleeding Edge Tech.
Goal: Answer visitor questions about Ulya's skills, projects, and contact info.
Constraints: 
- Keep answers under 3 sentences unless asked for details.
- If asked about sensitive info (address/phone), politely refuse.
- Always answer in the language the user uses (Indonesian/English).
`

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody(event)
  
  // 1. Validasi Input
  if (!body.messages || !Array.isArray(body.messages)) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid messages format' })
  }

  // 2. Validasi API Key
  if (!config.openRouterKey) {
    throw createError({ statusCode: 500, statusMessage: 'OpenRouter Key is missing' })
  }

  // 3. Request ke OpenRouter
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': config.public.siteUrl, // Required by OpenRouter
        'X-Title': 'Ulya Portfolio',
      },
      body: JSON.stringify({
        model: 'qwen/qwen-2.5-72b-instruct', // Model murah & cerdas
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...body.messages
        ],
        stream: true, // WAJIB TRUE untuk efek ngetik
      })
    })

    if (!response.ok) {
      const err = await response.json()
      throw createError({ statusCode: response.status, statusMessage: err.error?.message || 'AI Error' })
    }

    // 4. Handle Stream Response
    // Kita gunakan sendStream untuk meneruskan raw stream ke client
    return sendStream(event, response.body!)

  } catch (error: any) {
    console.error('AI Error:', error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
  }
})