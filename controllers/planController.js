const Student = require('../models/Student');
const User = require('../models/User');

const getPlans = async (req, res) => {
  try {
    const plans = [
      {
        id: 1,
        name: "Basic Plan",
        price: "₹799/year",
        features: ["Basic report cards", "Student management"],
        status: "available"
      },
      {
        id: 2,
        name: "Premium Plan", 
        price: "₹999/year",
        features: ["AI-powered insights", "Advanced analytics", "All basic features"],
        status: "available"
      }
    ];
    
    res.json({ plans });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStudentSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Student.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'parentId',
          foreignField: '_id',
          as: 'parent'
        }
      },
      { $unwind: { path: '$parent', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          studentId: 1,
          studentName: '$name',
          email: '$parent.email',
          class: 1,
          section: 1,
          plan: '$parent.subscription.plan',
          status: '$parent.subscription.status',
          amount: '$parent.subscription.amount'
        }
      },
      { $sort: { class: 1, section: 1, studentName: 1 } }
    ]);
    
    res.json({ subscriptions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCurrentPlan = async (req, res) => {
  try {
    // Placeholder for current user plan
    const currentPlan = {
      planId: 1,
      name: "Basic Plan",
      expiryDate: "2024-12-31",
      status: "active",
      message: "Current plan - placeholder implementation"
    };
    
    res.json(currentPlan);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const upgradePlan = async (req, res) => {
  try {
    // Placeholder for plan upgrade
    const { planId } = req.body;
    
    const result = {
      success: true,
      newPlan: planId,
      message: "Plan upgrade - placeholder implementation"
    };
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPlans,
  getCurrentPlan,
  upgradePlan,
  getStudentSubscriptions
};