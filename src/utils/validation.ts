import { z } from 'zod';

export const addressSchema = z.object({
  cep: z.string().length(8, 'CEP inválido'),
  street: z.string().min(1, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, 'Bairro é obrigatório'),
  city: z.string().min(1, 'Cidade é obrigatória'),
  state: z.string().length(2, 'Estado inválido')
});

export const serviceSchema = z.object({
  type: z.enum(['accommodation', 'tour', 'boat', 'guide']),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  description: z.string().min(10, 'Descrição deve ter no mínimo 10 caracteres'),
  price: z.number().positive('Preço deve ser maior que zero'),
  priceType: z.enum(['per_person', 'per_group']).optional(),
  location: z.string().min(1, 'Localização é obrigatória'),
  address: addressSchema,
  images: z.array(z.string()).min(1, 'Adicione pelo menos uma imagem'),
  supplierId: z.string()
});

export const userSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').optional(),
  phone: z.string().optional(),
  address: addressSchema.optional()
});