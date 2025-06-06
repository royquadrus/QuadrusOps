import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z
        .string()
        .min(4, 'Password must be at least 4 characters')
        .max(100, 'Password is too long'),
});

export const registerSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z
        .string()
        .min(4, 'Password must be at least 4 characters')
        .max(100, 'Password is too long'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Paswords don't match",
    path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;