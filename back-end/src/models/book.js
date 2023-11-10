import { z } from 'zod'

const maxYear = new Date()   // Hoje

const Book = z.object({

  title: 
    z.string()
    .min(1, { message: 'O título deve conter no mínimo 1 caractere.' })
    .max(200, { message: 'O título pode conter até 200 caracteres.' }),
  
  author: 
    z.string()
    .min(1, { message: 'O nome do autor deve conter no mínimo 1 caractere.' })
    .max(200, { message: 'O nome do autor pode conter até 200 caracteres.' }),
  
  year: 
    // coerce força a conversão para o tipo Date, se o dado recebido for string
    z.coerce.date()
    .max(maxYear, { message: 'O cliente deve ser maior de 18 anos.' }),
  
  belongs_to: 
    z.string()
    .min(1, { message: 'O da instituição deve conter no mínimo 1 caractere.' })
    .max(100, { message: 'O nome da instituição pode conter até 100 caracteres.' }),
  
  publisher_id:
    z.string()
    .min(1, { message:'O ID deve conter no mínimo 1 dígito.' })
    .max(10, { message:'O ID deve conter no máximo 10 dígitos.' })
    
})

export default Book
