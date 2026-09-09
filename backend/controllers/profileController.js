const User = require('../models/User');
const Scan = require('../models/Scan');
const { getIsConnected } = require('../config/db');
const { memoryUsers } = require('./authController');
const { memoryScans } = require('./scanController');

const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let userObj;
    let totalScans = 0;
    let recyclableItems = 0;
    let mostScannedPolymer = 'N/A';

    if (getIsConnected()) {
      const user = await User.findById(userId).select('-passwordHash');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }
      userObj = user.toObject();

      totalScans = await Scan.countDocuments({ userId });
      recyclableItems = await Scan.countDocuments({
        userId,
        'recyclability.level': { $in: ['High', 'Moderate'] },
      });

      const topPolymer = await Scan.aggregate([
        { $match: { userId } },
        { $group: { _id: '$polymer', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 },
      ]);
      mostScannedPolymer = topPolymer[0]?._id || 'N/A';
    } else {
      const user = memoryUsers.find((u) => String(u._id) === String(userId)) || {
        _id: userId,
        name: req.user.name || 'Demo User',
        email: req.user.email || 'demo@polyscan.ai',
        createdAt: new Date(),
        preferences: { emailNotifications: true, theme: 'light' },
      };
      userObj = user;

      const userScans = memoryScans.filter((s) => String(s.userId) === String(userId));
      totalScans = userScans.length;
      recyclableItems = userScans.filter((s) =>
        ['High', 'Moderate'].includes(s.recyclability?.level)
      ).length;

      const counts = {};
      userScans.forEach((s) => {
        counts[s.polymer] = (counts[s.polymer] || 0) + 1;
      });
      let maxCount = 0;
      Object.entries(counts).forEach(([p, c]) => {
        if (c > maxCount) {
          maxCount = c;
          mostScannedPolymer = p;
        }
      });
    }

    return res.json({
      success: true,
      user: userObj,
      stats: {
        totalScans,
        recyclableItems,
        mostScannedPolymer,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, preferences } = req.body;

    if (getIsConnected()) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found.' });
      }

      if (name) user.name = name;
      if (preferences) user.preferences = { ...user.preferences, ...preferences };

      await user.save();
      const updatedUser = user.toObject();
      delete updatedUser.passwordHash;

      return res.json({ success: true, user: updatedUser, message: 'Profile updated successfully.' });
    } else {
      const user = memoryUsers.find((u) => String(u._id) === String(userId));
      if (user) {
        if (name) user.name = name;
        if (preferences) user.preferences = { ...user.preferences, ...preferences };
      }
      return res.json({
        success: true,
        user: user || { id: userId, name: name || 'Demo User' },
        message: 'Profile updated successfully.',
      });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
