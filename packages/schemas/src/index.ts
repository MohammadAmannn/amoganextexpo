import { z } from 'zod'

export const emailSchema = z.string().email()
export const passwordSchema = z.string().min(8)
export const signInSchema = z.object({ email: emailSchema, password: passwordSchema })
export const signUpSchema = signInSchema.extend({ fullName: z.string().min(2).max(120) })
export const organizationSchema = z.object({ name: z.string().min(2).max(120), slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/) })
export const todoCreateSchema = z.object({ title: z.string().trim().min(1).max(240) })
export type SignInInput = z.infer<typeof signInSchema>
export type SignUpInput = z.infer<typeof signUpSchema>
export type TodoCreateInput = z.infer<typeof todoCreateSchema>
