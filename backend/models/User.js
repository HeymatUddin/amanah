const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
    },

    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    role: {
      type: String,
      enum: ['admin', 'member'],
      default: 'member',
    },

    membershipType: {
      type: String,
      enum: ['core', 'general'],
      default: 'general',
    },

    status: {
      type: String,
      enum: ['pending', 'active', 'suspended', 'disabled'],
      default: 'pending',
    },

    shares: {
      type: Number,
      default: 1,
      min: 1,
      validate: {
        validator: Number.isSafeInteger,
        message: 'Shares must be a whole number',
      },
    },
    application: {
      type: new mongoose.Schema(
        {
          phone: String,
          dateOfBirth: String,
          occupation: String,
          idType: String,
          idNumber: String,
          idIssuingCountry: String,
          addressLine1: String,
          addressLine2: String,
          city: String,
          region: String,
          postalCode: String,
          country: String,
          referringMember: String,
          introduction: String,
          consentedAt: Date,
        },
        { _id: false },
      ),
      select: false,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  {
    timestamps: true,
  },
)

module.exports = mongoose.model('User', userSchema)