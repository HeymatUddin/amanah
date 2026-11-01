const express = require('express')
const mongoose = require('mongoose')
const { rateLimit } = require('express-rate-limit')

const User = require('../models/User')
const requireFirebase = require('../middleware/requireFirebase')
const requireMember = require('../middleware/requireMember')

const router = express.Router()

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
})

const applicationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    message: 'Too many application attempts. Please try later.',
  },
})

function requireAdmin(req, res, next) {
  if (req.member.role !== 'admin') {
    return res.status(403).json({
      message: 'Administrator access required.',
    })
  }

  next()
}

function publicMember(member) {
  return {
    id: member._id,
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email,
    role: member.role,
    membershipType: member.membershipType,
    status: member.status,
    shares: member.shares,
  }
}

function readApplication(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    throw new Error('Invalid application.')
  }

  const limits = {
    firstName: 100,
    lastName: 100,
    phone: 30,
    dateOfBirth: 10,
    occupation: 120,
    idType: 30,
    idNumber: 50,
    idIssuingCountry: 100,
    addressLine1: 200,
    addressLine2: 200,
    city: 100,
    region: 100,
    postalCode: 20,
    country: 100,
    referringMember: 150,
    introduction: 2000,
  }

  const optional = new Set([
    'occupation',
    'addressLine2',
    'postalCode',
    'referringMember',
  ])

  const fields = {}

  for (const [key, max] of Object.entries(limits)) {
    const value = body[key] ?? ''

    if (typeof value !== 'string') {
      throw new Error(`Invalid ${key}.`)
    }

    const text = value.trim()

    if (
      (!optional.has(key) && !text) ||
      text.length > max
    ) {
      throw new Error(`Please check ${key}.`)
    }

    fields[key] = text
  }

  if (
    !['national-id', 'passport', 'driving-licence'].includes(
      fields.idType,
    )
  ) {
    throw new Error('Please select a valid ID type.')
  }

  const date = new Date(`${fields.dateOfBirth}T00:00:00Z`)

  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(fields.dateOfBirth) ||
    !Number.isFinite(date.getTime()) ||
    date.toISOString().slice(0, 10) !== fields.dateOfBirth ||
    date > new Date()
  ) {
    throw new Error('Please enter a valid date of birth.')
  }

  if (
    typeof body.shares !== 'number' ||
    !Number.isSafeInteger(body.shares) ||
    body.shares < 1
  ) {
    throw new Error('Shares must be a positive whole number.')
  }

  if (
    body.informationConfirmed !== true ||
    body.policyAccepted !== true ||
    body.reviewConsent !== true
  ) {
    throw new Error('Please accept all required declarations.')
  }

  return {
    firstName: fields.firstName,
    lastName: fields.lastName,
    shares: body.shares,
    application: {
      ...Object.fromEntries(
        Object.entries(fields).filter(
          ([key]) => !['firstName', 'lastName'].includes(key),
        ),
      ),
      consentedAt: new Date(),
    },
  }
}

// Signed-in applicants can check their own status.
router.get('/status', requireFirebase, async (req, res, next) => {
  try {
    const member = await User.findOne({
      firebaseUid: req.firebaseUser.uid,
    })

    res.json({
      status: member ? member.status : 'not-submitted',
      member: member ? publicMember(member) : null,
    })
  } catch (error) {
    next(error)
  }
})

// Firebase identity is verified before saving an application.
// Email, role and status are never accepted from the form.
router.post(
  '/apply',
  applicationLimiter,
  requireFirebase,
  async (req, res, next) => {
    try {
      if (!req.firebaseUser.email) {
        return res.status(400).json({
          message: 'An email account is required.',
        })
      }

      let input

      try {
        input = readApplication(req.body)
      } catch (error) {
        return res.status(400).json({
          message: error.message,
        })
      }

      const existing = await User.findOne({
        firebaseUid: req.firebaseUser.uid,
      })

      if (existing) {
        return res.json({
          status: existing.status,
          message: 'Your application is already recorded.',
        })
      }

      const member = await User.create({
        ...input,
        firebaseUid: req.firebaseUser.uid,
        email: req.firebaseUser.email,
        role: 'member',
        membershipType: 'general',
        status: 'pending',
      })

      res.status(201).json({
        status: member.status,
        message: 'Application submitted. Awaiting admin approval.',
      })
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          message:
            'An account already exists. Please sign in and check your application status.',
        })
      }

      next(error)
    }
  },
)

// Admin request list: excludes private identity and address fields.
router.get(
  '/applications',
  requireMember,
  requireAdmin,
  async (req, res, next) => {
    try {
      const applications = await User.find({
        status: 'pending',
      })
        .select('firstName lastName email shares status createdAt')
        .sort({ createdAt: -1, _id: -1 })
        .limit(100)
        .lean()

      res.json({ applications })
    } catch (error) {
      next(error)
    }
  },
)

// Full details are available only to an active admin.
router.get(
  '/applications/:id',
  requireMember,
  requireAdmin,
  async (req, res, next) => {
    try {
      if (!mongoose.isObjectIdOrHexString(req.params.id)) {
        return res.status(400).json({
          message: 'Invalid application ID.',
        })
      }

      const application = await User.findById(req.params.id)
        .select(
          'firstName lastName email shares status createdAt +application',
        )
        .lean()

      if (!application) {
        return res.status(404).json({
          message: 'Application not found.',
        })
      }

      res.json({ application })
    } catch (error) {
      next(error)
    }
  },
)

router.patch(
  '/applications/:id',
  requireMember,
  requireAdmin,
  async (req, res, next) => {
    try {
      if (!mongoose.isObjectIdOrHexString(req.params.id)) {
        return res.status(400).json({
          message: 'Invalid application ID.',
        })
      }

      const decision = req.body?.decision

      if (!['approve', 'reject'].includes(decision)) {
        return res.status(400).json({
          message: 'Choose approve or reject.',
        })
      }

      const application = await User.findOneAndUpdate(
        {
          _id: req.params.id,
          status: 'pending',
          role: 'member',
        },
        {
          $set: {
            status: decision === 'approve' ? 'active' : 'disabled',
            reviewedBy: req.member._id,
            reviewedAt: new Date(),
          },
        },
        {
          new: true,
          runValidators: true,
        },
      )

      if (!application) {
        return res.status(409).json({
          message:
            'Application was not found or has already been reviewed.',
        })
      }

      res.json({
        status: application.status,
        message:
          decision === 'approve'
            ? 'Membership approved.'
            : 'Application rejected.',
      })
    } catch (error) {
      next(error)
    }
  },
)

module.exports = router