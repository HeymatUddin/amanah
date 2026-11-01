require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const requireMember = require('./middleware/requireMember')
const app = express()
const membershipRoutes = require('./routes/membership')
const User = require('./models/User')
const PORT = Number(process.env.PORT) || 5000
const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN || 'http://localhost:5173'

app.disable('x-powered-by')

app.use(helmet())

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
)

app.use(express.json({ limit: '20kb' }))
app.use('/api/membership', membershipRoutes)

app.get('/api/health', (req, res) => {
  const connected = mongoose.connection.readyState === 1

  res.status(connected ? 200 : 503).json({
    message: 'Amanah backend is running',
    database: connected ? 'connected' : 'disconnected',
  })
})
app.get('/api/auth/me', requireMember, (req, res) => {
  res.set('Cache-Control', 'no-store')

  res.json({
    member: {
      id: req.member._id,
      firstName: req.member.firstName,
      lastName: req.member.lastName,
      email: req.member.email,
      role: req.member.role,
      membershipType: req.member.membershipType,
      shares: req.member.shares,
    },
  })
})
app.use((req, res) => {
  res.status(404).json({
    message: 'API endpoint not found',
  })
})

app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    message:
      error.status === 400
        ? 'Invalid request'
        : 'Something went wrong',
  })
})

async function startServer() {
  if (!process.env.MONGODB_URI) {
    console.error('Missing MONGODB_URI in backend/.env')
    process.exit(1)
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'amanah',
      serverSelectionTimeoutMS: 10000,
    })
    await User.init()
    console.log('MongoDB connected successfully')

    app.listen(PORT, '127.0.0.1', () => {
      console.log(
        `Amanah backend: http://localhost:${PORT}`,
      )
    })
  } catch (error) {
    console.error(
      'Database connection failed. Check your Atlas credentials and IP access.',
    )
    console.error('Error type:', error.name)
    process.exit(1)
  }
}

startServer()