import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    tenantId:   { type: String, required: true, index: true },
    email:      { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true, select: false },
    roles:      { type: [String], default: ['student'], index: true },

    // Nombre real del usuario (con espacios, tildes, etc.)
    profile: {
      name: String,
      locale: String,
      pictureUrl: String,
      timeZone: String,
    },

    isActive:      { type: Boolean, default: true },
    emailVerified: { type: Boolean, default: false },

    refreshSessions: [{
      sid: String,
      refreshHash: String,
      createdAt: { type: Date, default: Date.now },
      revokedAt: { type: Date }
    }]
  },
  { timestamps: true, versionKey: false }
);

// Unicidad por tenant + email
UserSchema.index({ tenantId: 1, email: 1 }, { unique: true });

export const User = mongoose.model('User', UserSchema);
