const router = require('express').Router()
const controller = require('../controllers/itemController')
const middleware = require('../middleware')

router.get('/', controller.GetItems)

router.get('/user/:userId', controller.GetItemsByUserId)

router.get('/:id', controller.GetItemById)

router.post('/', middleware.stripToken, middleware.verifyToken, controller.CreateItem)
router.put('/:id', middleware.stripToken, middleware.verifyToken, controller.UpdateItem)
router.delete('/:id', middleware.stripToken, middleware.verifyToken, controller.DeleteItem)

module.exports = router
