import { Router } from 'express'
import controller from '../controllers/user.js'

const router = Router()

router.post('/', controller.create)
router.get('/', controller.retrieveAll)
router.get('/:cpf', controller.retrieveOne)
router.put('/:cpf', controller.update)
router.delete('/:cpf', controller.delete)

export default router