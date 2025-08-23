const User = require('../models/User');
const Student = require('../models/Student');
const jwt = require('jsonwebtoken');

// Generate 4-digit OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// Send OTP to mobile (mock implementation)
const sendOTP = async (mobile, otp) => {
  console.log(`Sending OTP ${otp} to mobile: ${mobile}`);
  // In production, integrate with SMS service like Twilio, AWS SNS, etc.
  return true;
};

// Request OTP for mobile login
exports.requestOTP = async (req, res) => {
  try {
    const { mobile, email } = req.body;
    
    // First find user by mobile number only
    const user = await User.findOne({ mobile, role: 'Parent' });
    if (!user) {
      return res.status(404).json({ message: 'Mobile number not registered' });
    }
    
    // Verify email matches the one in database
    if (user.email !== email) {
      return res.status(400).json({ message: 'Email does not match registered email for this mobile number' });
    }
    
    // Generate and save OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    
    user.otp = { code: otp, expiresAt, verified: false };
    await user.save();
    
    // Send OTP to registered mobile number
    await sendOTP(user.mobile, otp);
    
    res.json({ 
      message: 'OTP sent successfully',
      userId: user._id 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout/Switch Account
exports.logout = async (req, res) => {
  try {
    res.json({
      message: 'Logged out successfully',
      redirectTo: 'login'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Verify OTP and login
exports.verifyOTPAndLogin = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check OTP validity
    if (!user.otp.code || user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }
    
    if (new Date() > user.otp.expiresAt) {
      return res.status(400).json({ message: 'OTP expired' });
    }
    
    // Mark OTP as verified and clear it
    user.otp = { verified: true };
    await user.save();
    
    // Get student data with profile pictures
    const students = await Student.find({ parentId: user._id })
      .select('studentId name class section teacher profilePicture');
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, name: user.name }, 
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        role: user.role
      },
      children: students.map(student => ({
        id: student._id,
        name: student.name,
        class: student.class,
        section: student.section,
        teacher: student.teacher,
        profilePicture: student.profilePicture || '/uploads/profiles/default-student.png'
      })),
      redirectTo: 'whosLearningToday'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};