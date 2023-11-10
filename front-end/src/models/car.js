import { z } from 'zod'

// O cliente deve ser maior de 18 anos
// Por isso, para validar, calculamos a data máxima em que
// o cliente pode ter nascido para ter 18 anos na data de hoje
const maxSellingDate = new Date()   // Hoje

const Car = z.object({
  brand: 
    z.string()
    .min(1, { message: 'O nome da marca deve ter, no mínimo, 1 caractere' })
    .max(25, { message: 'O nome da marca pode conter, no máximo, 25 caracteres' }),
  
  model: 
    z.string()
    .min(1, { message: 'O nome do modelo deve ter, no mínimo, 1 caractere' })
    .max(25, { message: 'O nome do modelo pode conter, no máximo, 25 caracteres' }),

  color: 
    z.string()
    .min(4, { message: 'O nome da cor deve ter, no mínimo, 1 caractere' })
    .max(20, { message: 'O nome da cor pode conter, no máximo, 25 caracteres' }),

  year_manufacture: 
    z.coerce.number()
    .min(1940, { message: 'Escolha um ano entre 1940 à 2023' })
    .max(2023, { message: 'Escolha um ano entre 1940 à 2023' }),
  
  imported:
    z.boolean(),

  plates: 
    z.string()
    .transform(v => v.replace('_', '')) 
    // Depois de um transform(), não podemos usar length(). Por isso, temos que
    // usar refine() passando uma função personalizada para validar o tamanho do campo
    .refine(v => v.length == 8, { message: 'Os digitos da placa estão incorretos' }),

  selling_date:
    z.coerce.date()
    .max(maxSellingDate, { message: 'Este campo não pode ser posterior a data de hoje' })
    .nullable(),
    
  selling_price:
    z.coerce.number()
    .min(2000, { message: 'O valor mínimo para preço de venda é de R$2.000,00' })
    .nullable(),
  
  customer_id: 
    z.coerce.number()
    .min(0, { message: 'O ID deve ser positivo' })
    .nullable(),
})

export default Car
