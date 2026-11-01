const firebaseAuth = require('../config/firebase')
const User = require('../models/User')

async function requireMember(req, res, next) {
  const authorization = req.get('Authorization') || ''
  const match = authorization.match(/^Bearer (\S+)$/i)

  if (!match) {
    return res.status(401).json({
      message: 'Please sign in to continue.',
    })
  }

  let decodedToken

  try {
    // true checks whether the token has been revoked
    // or the Firebase account has been disabled.
    decodedToken = await firebaseAuth.verifyIdToken(
      match[1],
      true,
    )
  } catch (error) {
    const authenticationErrors = [
      'auth/argument-error',
      'auth/invalid-argument',
      'auth/invalid-id-token',
      'auth/id-token-expired',
      'auth/id-token-revoked',
      'auth/user-disabled',
      'auth/user-not-found',
    ]

    if (authenticationErrors.includes(error.code)) {
      return res.status(401).json({
        message: 'Your session is invalid. Please sign in again.',
      })
    }

    return res.status(503).json({
      message: 'Sign-in verification is temporarily unavailable.',
    })
  }

  try {
    const member = await User.findOne({
      firebaseUid: decodedToken.uid,
    })

    if (!member || member.status !== 'active') {
      return res.status(403).json({
        message:
          'Your membership is not active. Please contact the Amanah team.',
      })
    }

    req.member = member
    req.firebaseUser = decodedToken

    next()
  } catch (error) {
    next(error)
  }
}

module.exports = requireMember