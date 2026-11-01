const firebaseAuth = require('../config/firebase')

async function requireFirebase(req, res, next) {
  res.set('Cache-Control', 'no-store')

  const authorization = req.get('Authorization') || ''
  const match = authorization.match(/^Bearer (\S+)$/i)

  if (!match) {
    return res.status(401).json({
      message: 'Please sign in to continue.',
    })
  }

  try {
    req.firebaseUser = await firebaseAuth.verifyIdToken(
      match[1],
      true,
    )
  } catch (error) {
    const invalidCredentials = [
      'auth/argument-error',
      'auth/invalid-argument',
      'auth/invalid-id-token',
      'auth/id-token-expired',
      'auth/id-token-revoked',
      'auth/user-disabled',
      'auth/user-not-found',
    ]

    return res
      .status(invalidCredentials.includes(error.code) ? 401 : 503)
      .json({
        message: invalidCredentials.includes(error.code)
          ? 'Please sign in again.'
          : 'Account verification is temporarily unavailable.',
      })
  }

  next()
}

module.exports = requireFirebase