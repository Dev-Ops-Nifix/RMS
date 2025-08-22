const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const reportCardRoutes = require('./routes/reportCards');
const authRoutes = require('./routes/auth');
const parentRoutes = require('./routes/parents');
const studentRoutes = require('./routes/students');
const teacherRoutes = require('./routes/teachers');
const messageRoutes = require('./routes/messages');
const teacherMessageRoutes = require('./routes/teacherMessages');
const adminTeacherRoutes = require('./routes/adminTeachers');
const adminTeacherChatRoutes = require('./routes/adminTeacherChat');
const mobileParentRoutes = require('./routes/mobileParent');
const dashboardRoutes = require('./routes/dashboard');
const performanceRoutes = require('./routes/performance');
const planRoutes = require('./routes/plans');
const supportRoutes = require('./routes/support');
const testRoutes = require('./routes/tests');
const eventRoutes = require('./routes/events');
const settingsRoutes = require('./routes/settings');
const profileRoutes = require('./routes/profile');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/auth', authRoutes);
app.use('/api/report-cards', reportCardRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/teacher-messages', teacherMessageRoutes);
app.use('/api/admin/teachers', adminTeacherRoutes);
app.use('/api/admin-teacher-chat', adminTeacherChatRoutes);
app.use('/api/mobile/parent', mobileParentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/profile', profileRoutes);

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/report-card-system', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));