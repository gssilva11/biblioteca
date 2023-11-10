import { Router } from 'express'
import controller from '../controllers/book.js'

const router = Router()

router.post('/', controller.create)
router.get('/', controller.retrieveAll)
router.get('/:code', controller.retrieveOne)
router.put('/:code', controller.update)
router.delete('/:code', controller.delete)

export default router