import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 30 },
  email: {
    type: String,
    required: true,
    unique: true,
    //lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
mobile: { 
    type: String, 
    required: function() {
      return this.provider === 'local'; // Only required for local authentication
    }, 
    validate: {
      validator: function(v) {
        // Only validate if provider is local
        return this.provider !== 'local' || /^[0-9]{10}$/.test(v);
      },
      message: 'Enter a valid 10-digit mobile'
    }
    
  },
  password: { type: String,     required: function() {
      return this.provider === 'local'; // Only required for local authentication
    }, minLength: 8, select: false },
  role: { type: String, enum: ['trekker', 'admin'], default: 'trekker' },
  isAdmin: { type: Boolean, default: false },
    provider: { type: String, enum: ['local', 'google'], default: 'local' },
  googleId: { type: String, unique: true, sparse: true },
  isBlocked:{type:Boolean, default:false},
  avatar:{
    type:String,
    default:""
  },
verifytoken:{
  type:String
},
  createdAt: { type: Date, default: Date.now },
});

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare entered password with hashed
userSchema.methods.comparePassword = async function(enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT
userSchema.methods.getJWTToken = function() {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_KEY,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

export const User = mongoose.model('User', userSchema);