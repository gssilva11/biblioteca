import { z } from 'zod'
import { cpf } from 'cpf-cnpj-validator'

const User = z.object({
  cpf: 
    z.string()
    .trim()
    .length(14, { message: 'O CPF está incompleto'})
    .refine(val => cpf.isValid(val), { message: 'CPF inválido' }),
  
  email: 
    z.string()
    .email({ message: 'E-mail inválido' }),
  
  name: 
    z.string()
    .min(5, { message: 'O nome deve ter, no mínimo, 5 caracteres' }),
  
  city: 
    z.string()
    .max(40, { message: 'A cidade pode conter, no máximo, 40 caracteres' }),
  
  state: 
    z.string()
    .length(2, { message: 'UF deve ter, exatamente, 2 caracteres' }),
    
  institution: 
    z.string()
    .min(5, { message: 'O nome da instituição deve ter, no mínimo, 2 caracteres' })
    .max(30, { message: 'O nome da instituição deve ter, no máximo, 30 caracteres' }),
})

export default User
