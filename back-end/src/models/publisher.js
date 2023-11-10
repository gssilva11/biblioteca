import { z } from 'zod'

const Publisher = z.object({  
  name_publisher: 
    z.string()
    .min(1, { message: 'O nome da editora deve ter, no mínimo, 1 caractere.' })
    .max(50, { message: 'O nome da editora deve ter, no máximo, 50 caracteres.' }),
  
  city_publisher: 
    z.string()
    .min(2, { message: 'O nome da cidade deve ter, no mínimo, 2 caracteres' })
    .max(20, { message: 'O nome da cidade deve ter, no máximo, 20 caracteres' }),
  
  state_publisher: 
    z.string()
    .min(4, { message: 'O nome do estado deve ter, no mínimo, 4 caracteres' })
    .max(20, { message: 'O nome da cidade deve ter, no máximo, 20 caracteres' }),

})

export default Publisher
