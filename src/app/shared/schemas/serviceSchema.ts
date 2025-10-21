// schemas/serviceSchema.ts
import { z } from 'zod';
import { EServiceCategory } from '@/types/service';

export const serviceFormSchema = z.object({
    name: z.string()
        .min(3, 'O nome deve ter pelo menos 3 caracteres')
        .max(100, 'O nome deve ter no máximo 100 caracteres'),
    description: z.string()
        .max(500, 'A descrição deve ter no máximo 500 caracteres')
        .optional(),
    category: z.nativeEnum(EServiceCategory, {
        error: 'Selecione uma categoria válida'
    }),
    duration: z.number()
        .min(1, 'A duração deve ser de pelo menos 1 minuto')
        .max(1440, 'A duração não pode exceder 24 horas (1440 minutos)'),
    price: z.number()
        .min(0.01, 'O preço deve ser maior que 0')
        .max(1000000, 'O preço não pode exceder 1.000.000 Kz'),
});

export type ServiceFormData = z.infer<typeof serviceFormSchema>;