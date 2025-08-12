const User = require('../models/User')
const middleware = require('../middleware')

const Register = async (req, res) => {
  const { email, password, name } = req.body
  try {
    let passwordDigest = await middleware.hashPassword(password)
    console.log('User model is:', User)
    let existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).send("A user with that email has already been registered!")
    } else {
      const user = await User.create({ email, passwordDigest, name })
      res.send(user)
    }
    
    } catch (error) {
    throw error
  }
}

const Login = async (req, res) => {
  try {
    // Extracts the necessary fields from the request body
    const { email, password } = req.body
    // Finds a user by a particular field (in this case, email)
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).send({ msg: 'User not found. Check your email.' })
    }
    // Checks if the password matches the stored digest
    let matched = await middleware.comparePassword(
      password,
      user.passwordDigest
    )
    // If they match, constructs a payload object of values we want on the front end
    if (!matched) {
      return res.status(401).send({ msg: 'Invalid password.' })
    } 
      let payload = {
        _id: user._id,
        email: user.email,
        name: user.name,
        isAdmin: user.isAdmin
      }

      // Creates our JWT and packages it with our payload to send as a response
      let token = middleware.createToken(payload)
      return res.send({ user: payload, token })
    
    res.status(401).send({ status: 'Error', msg: 'Unauthorized' })
  } catch (error) {
    console.log(error)
    res.status(401).send({ status: 'Error', msg: 'An error has occurred!' })
  }
}

const GetUserById = async (req, res) => {
  try {
    const { userId } = req.params

    const user = await User.findById(userId).select('_id name email createdAt')

    if (!user) {
      return res.status(404).send({ msg: 'User not found' })
    }

    res.status(200).send(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).send({ msg: 'Server error fetching user' })
  }
}

module.exports = {
  Register,
  Login,
  GetUserById
}
