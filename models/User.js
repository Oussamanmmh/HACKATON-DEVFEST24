const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    id: { type: Number, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String, default: null }, // for scalablity
    appleId: { type: String, default: null }, // for scalablity
    authProvider: {
      type: String,
      enum: ["email", "apple", "google"],
      default: "email",
    }, // for scalablity
    role: { type: String, enum: ["worker", "manager"], default: "worker" },
    refreshToken: { type: String },
    isVerified: { type: Boolean, default: false }, // for scalablity
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    phoneNumber: { type: String }, // for scalablity
    profileImage: {
      thumbnail: { type: String },
      full: { type: String },
      default: { type: String },
    },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }], // for scalablity
    otp: { type: String }, // for scalablity
    otpExpires: { type: Date }, // for scalablity
    notificationsToken: { type: String },
    status: { type: String, enum: ["active", "inactive"], default: "active" }, // for scalablity
    bio: { type: String }, // for scalablity
    language: { type: String, default: "en" }, // for scalablity
    lastLogin: { type: Date }, // for scalablity
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }], 
    socialMediaLinks: {
      // for scalablity
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
