const express = require('express')
const logger = require('morgan')

const authRouter = require('./routes/authRouter')
const itemRouter = require('./routes/itemRouter')
const claimRequestRouter = require('./routes/claimRequestRouter')

const PORT = process.env.PORT || 3000

const db = require('./db')

const app = express()

const cors = require('cors');
app.use(cors({
  origin: 'https://wainah.surge.sh' // imported cors to enable backend
}))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))



app.use('/auth', authRouter)
app.use('/items', itemRouter)
app.use('/claims', claimRequestRouter)

app.get('/', (req, res) => {
  res.send(`Connected!`)
})

app.listen(PORT, () => {
  console.log(`Running Express server on Port ${PORT} . . .`)
})
