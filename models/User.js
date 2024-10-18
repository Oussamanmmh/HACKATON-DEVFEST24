const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  id: { type: Number, unique: true }, 
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  googleId: { type: String, default: null }, 
  appleId: { type: String, default: null }, 
  authProvider: { type: String, enum: ['google', 'apple', 'email'], default: 'email' }, 
  role: { type: String, enum: ['user', 'delivery', 'admin'], default: 'user' },
  refreshToken: { type: String },
  isVerified: { type: Boolean, default: false },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
  phoneNumber: { type: String,   },  
  address: { type: String,   }, 
  savedAddresses: [{ type: String, default: [] }], 
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', default: [] }],
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order', default: [] }],
  profileImage: {
    thumbnail: { type: String,   }, 
    full: { type: String,   }, 
    default: { type: String,   }, 
  },
  // add otp
  otp: { type: String,   },
  otpExpires: { type: Date },
  notificationsToken: { type: String,   },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  bio: { type: String,   },  
  language: { type: String, default: 'en' },
  lastLogin: { type: Date },
  reviewCount: { type: Number, default: 0 },
  locationCoordinates: {
    lat: { type: Number, default: 0 },  
    lon: { type: Number, default: 0 },  
  },
  socialMediaLinks: {
    facebook: { type: String,   },
    twitter: { type: String,   },
    instagram: { type: String,   },
  },  
}, {
  timestamps: true,
});



userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


const User = mongoose.model('User', userSchema);
module.exports = User;
