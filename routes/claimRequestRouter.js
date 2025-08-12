const router = require('express').Router()
const controller = require('../controllers/claimRequestController')
const middleware = require('../middleware')

router.post('/', middleware.stripToken, middleware.verifyToken, controller.CreateClaimRequest)

router.get('/item/:itemId', middleware.stripToken, middleware.verifyToken, controller.GetClaimsForItem)

router.put('/:claimId/status', middleware.stripToken, middleware.verifyToken, controller.UpdateClaimStatus)

router.get('/user', middleware.stripToken, middleware.verifyToken, controller.GetClaimsByUserId)

router.delete('/:claimId', middleware.stripToken, middleware.verifyToken, controller.DeleteClaimRequest)

router.delete('/:claimId', middleware.stripToken, middleware.verifyToken, controller.DeleteClaimRequest)

router.put('/:claimId', middleware.stripToken, middleware.verifyToken, controller.EditClaimRequest)
router.get('/:claimId', middleware.stripToken, middleware.verifyToken, controller.GetClaimById)


module.exports = router
