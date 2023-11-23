import { z } from 'zod'
import { cpf } from 'cpf-cnpj-validator'

const User = z.object({
  cpf: 
    z.string()
    .trim()
    .length(14, { message: 'O CPF está incompleto'})
    .refine(val => cpf.isValid(val), { message: 'CPF inválido' }),
  
})

export default User
