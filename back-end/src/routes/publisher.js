import { Router } from 'express'
import controller from '../controllers/publisher.js'

const router = Router()

router.post('/', controller.create)
router.get('/', controller.retrieveAll)
router.get('/:id_publisher', controller.retrieveOne)
router.put('/:id_publisher', controller.update)
router.delete('/:id_publisher', controller.delete)

export default router