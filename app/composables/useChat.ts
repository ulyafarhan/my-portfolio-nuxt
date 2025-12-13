export interface Message {
  role: 'user' | 'assistant'
  content: string
}

export const useChat = () => {
  const messages = useState<Message[]>('chat-messages', () => [
    { role: 'assistant', content: 'Halo! Saya DevBot. Ada yang bisa saya bantu tentang Ulya?' }
  ])
  const isLoading = useState('chat-loading', () => false)

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading.value) return

    // 1. Tambah pesan user ke state
    const userMsg: Message = { role: 'user', content }
    messages.value.push(userMsg)
    
    // 2. Siapkan wadah pesan bot kosong
    const botMsgIndex = messages.value.push({ role: 'assistant', content: '' }) - 1
    isLoading.value = true

    try {
      // 3. Fetch ke Backend
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          // Kirim history terakhir (hemat token)
          messages: messages.value.slice(-5).map(m => ({ role: m.role, content: m.content })) 
        })
      })

      if (!response.body) throw new Error('No response body')

      // 4. Baca Stream (Magic Happens Here)
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        const chunkValue = decoder.decode(value)
        
        // OpenRouter mengirim format: data: { ... }
        // Kita perlu parse dan ambil content delta-nya
        const lines = chunkValue.split('\n').filter(line => line.trim() !== '')
        
        for (const line of lines) {
          if (line === 'data: [DONE]') return
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              const content = data.choices[0]?.delta?.content || ''
              // Append text ke pesan bot
              messages.value[botMsgIndex].content += content
            } catch (e) {
              // Ignore parse error on partial chunks
            }
          }
        }
      }

    } catch (error) {
      console.error('Chat Error:', error)
      messages.value[botMsgIndex].content += " [Error: Gagal terhubung ke AI]"
    } finally {
      isLoading.value = false
    }
  }

  return {
    messages,
    isLoading,
    sendMessage
  }
}