const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['SuperAdmin', 'Admin', 'Teacher', 'Parent'], required: true },
  name: String,
  teacherId: { type: String, unique: true, sparse: true },
  class: { type: String },
  section: { type: String },
  subscription: {
    plan: { type: String, enum: ['basic', 'premium'] },
    status: { type: String, enum: ['active', 'pending', 'expired'], default: 'pending' },
    amount: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date }
  }
});

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);