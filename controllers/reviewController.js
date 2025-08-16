const Review = require('../models/Review');
const Student = require('../models/Student');

const addReview = async (req, res) => {
  const { studentId, review } = req.body;
  try {
    const newReview = new Review({ studentId, review, teacherId: req.user.id });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getParentReviews = async (req, res) => {
  try {
    const students = await Student.find({ parentId: req.user.id }).select('_id');
    const studentIds = students.map(student => student._id);
    const reviews = await Review.find({ studentId: { $in: studentIds } }).populate('studentId', 'name').populate('teacherId', 'name');
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addReview, getParentReviews };