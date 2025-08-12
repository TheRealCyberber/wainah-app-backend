const router = require('express').Router()
const controller = require('../controllers/authController')
const middleware = require('../middleware')
const User = require('../models/User')


router.post('/login', controller.Login)
router.post('/register', controller.Register)
router.get('/session', middleware.stripToken, middleware.verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password')
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})
router.get('/users/:userId', middleware.stripToken, middleware.verifyToken, controller.GetUserById);


module.exports = router