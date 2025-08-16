const express = require('express');
const router = express.Router();
const reportCardController = require('../controllers/reportCardController');
const auth = require('../middleware/auth');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage: storage });

router.post('/upload', auth(['Admin', 'Teacher']), upload.any(), reportCardController.uploadReportCard);
router.get('/:studentId', auth(['Admin', 'Teacher']), reportCardController.getTeacherReportCard);
router.put('/:reportCardId/performance', auth(['Admin', 'Teacher']), reportCardController.updatePerformance);
router.get('/leaderboard/:classId', auth(['Admin', 'Teacher']), reportCardController.getClassLeaderboard);
router.get('/leaderboard/school/all', auth(['Admin']), reportCardController.getSchoolLeaderboard);
router.get('/classes/available', auth(['Admin', 'Teacher']), reportCardController.getAvailableClasses);

// Admin-only routes
router.get('/admin/all', auth(['Admin']), reportCardController.getAllReportCards);
router.get('/admin/class/:classId', auth(['Admin']), reportCardController.getReportCardsByClass);

module.exports = router;