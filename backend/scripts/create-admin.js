const path = require('node:path')

require('dotenv').config({
  path: path.resolve(__dirname, '../.env'),
})

const mongoose = require('mongoose')
const firebaseAuth = require('../config/firebase')
const User = require('../models/User')

async function createAdmin() {
  try {
    const {
      MONGODB_URI,
      ADMIN_FIREBASE_UID,
      ADMIN_FIRST_NAME,
      ADMIN_LAST_NAME,
    } = process.env

    if (
      !MONGODB_URI ||
      !ADMIN_FIREBASE_UID ||
      !ADMIN_FIRST_NAME ||
      !ADMIN_LAST_NAME
    ) {
      throw new Error('Missing required configuration.')
    }

    const firebaseUser = await firebaseAuth.getUser(
      ADMIN_FIREBASE_UID.trim(),
    )

    if (!firebaseUser.email || firebaseUser.disabled) {
      throw new Error(
        'Firebase user must have an email and be enabled.',
      )
    }

    await mongoose.connect(MONGODB_URI, {
      dbName: 'amanah',
      serverSelectionTimeoutMS: 10000,
    })

    // Ensure unique indexes exist before creating an account.
    await User.init()

    const existingUser = await User.findOne({
      firebaseUid: firebaseUser.uid,
    })

    if (existingUser) {
      console.log(
        'This user already exists. No account was changed.',
      )
      return
    }

    const existingAdmin = await User.exists({
      role: 'admin',
    })

    if (existingAdmin) {
      console.log(
        'An admin already exists. Bootstrap was stopped.',
      )
      return
    }

    await User.create({
      firebaseUid: firebaseUser.uid,
      firstName: ADMIN_FIRST_NAME.trim(),
      lastName: ADMIN_LAST_NAME.trim(),
      email: firebaseUser.email,
      role: 'admin',
      membershipType: 'core',
      status: 'active',
      shares: 1,
    })

    console.log('Admin account created successfully.')
  } catch (error) {
    if (error.code === 11000) {
      console.error(
        'Account creation stopped: email or UID already exists.',
      )
    } else {
      console.error(
        'Admin creation failed. Check configuration, Firebase user and database access.',
      )
      console.error('Error type:', error.code || error.name)
    }

    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

createAdmin()