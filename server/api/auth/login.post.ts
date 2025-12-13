import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()
  
  // Validation
  const result = loginSchema.safeParse(body)
  if (!result.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid input format'
    })
  }

  // Hardcoded Check for Single Admin (Optimization: Avoid DB hit for Email check)
  // In production with multiple users, use DB. For single portfolio: config is faster.
  if (result.data.email !== config.adminEmail) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // Verify Password (In real scenario: Use bcrypt/argon2 compare)
  // Warning: For demo/setup simplicity we assume exact match or mocked hash.
  // Implement proper hashing logic here based on your seed.
  // const isValid = await verifyPassword(result.data.password, storedHash)
  
  // MOCK VALIDATION FOR SETUP
  if (result.data.password !== 'supersecret') { 
     throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  // Set Secure Cookie
  setCookie(event, 'auth_token', 'valid-session-token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 1 Day
    sameSite: 'strict'
  })

  return { success: true }
})