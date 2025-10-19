import z from "zod";

export const registerSchema = z
    .object({
        name: z.string().min(3, 'O nome deve ter no mínimo 3 caracteres'),
        email: z.string().email('Email inválido'),
        nif: z
            .string()
            .regex(/^\d{9}$/, 'O NIF deve conter exatamente 9 dígitos'),
        phone: z
            .string()
            .regex(/^\d{9}$/, 'O telefone deve conter exatamente 9 dígitos'),
        password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'As senhas não coincidem',
    });

export type RegisterFormData = z.infer<typeof registerSchema>;