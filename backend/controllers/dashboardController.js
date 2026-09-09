const Scan = require('../models/Scan');
const { getIsConnected } = require('../config/db');
const { memoryScans } = require('./scanController');
const mongoose = require('mongoose');

const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    let totalScans = 0;
    let mostDetectedPolymer = 'N/A';
    let avgConfidence = 0;
    let recyclableCount = 0;
    let polymerDistribution = [];
    let activityTimeline = [];
    let recyclabilityDistribution = [];

    if (getIsConnected()) {
      const userObjectId = new mongoose.Types.ObjectId(userId);

      // 1. Total Scans
      totalScans = await Scan.countDocuments({ userId: userObjectId });

      if (totalScans > 0) {
        // 2. Average Confidence & Recyclable Count
        const avgResult = await Scan.aggregate([
          { $match: { userId: userObjectId } },
          {
            $group: {
              _id: null,
              avgConf: { $avg: '$confidence' },
            },
          },
        ]);
        avgConfidence = Math.round(avgResult[0]?.avgConf || 0);

        recyclableCount = await Scan.countDocuments({
          userId: userObjectId,
          'recyclability.level': { $in: ['High', 'Moderate'] },
        });

        // 3. Most Detected Polymer
        const topPolymer = await Scan.aggregate([
          { $match: { userId: userObjectId } },
          { $group: { _id: '$polymer', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 1 },
        ]);
        mostDetectedPolymer = topPolymer[0]?._id || 'N/A';

        // 4. Polymer Distribution
        const dist = await Scan.aggregate([
          { $match: { userId: userObjectId } },
          { $group: { _id: '$polymer', count: { $sum: 1 } } },
          { $project: { name: '$_id', value: '$count', _id: 0 } },
        ]);
        polymerDistribution = dist;

        // 5. Activity Timeline (last 7 days/entries)
        const timeline = await Scan.aggregate([
          { $match: { userId: userObjectId } },
          {
            $group: {
              _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
              scans: { $sum: 1 },
            },
          },
          { $sort: { _id: 1 } },
          { $project: { date: '$_id', scans: 1, _id: 0 } },
        ]);
        activityTimeline = timeline;

        // 6. Recyclability Distribution
        const recDist = await Scan.aggregate([
          { $match: { userId: userObjectId } },
          { $group: { _id: '$recyclability.level', count: { $sum: 1 } } },
          { $project: { name: '$_id', value: '$count', _id: 0 } },
        ]);
        recyclabilityDistribution = recDist;
      }
    } else {
      // Memory fallback aggregation
      const userScans = memoryScans.filter((s) => String(s.userId) === String(userId));
      totalScans = userScans.length;

      if (totalScans > 0) {
        const sumConf = userScans.reduce((acc, s) => acc + (s.confidence || 0), 0);
        avgConfidence = Math.round(sumConf / totalScans);

        recyclableCount = userScans.filter((s) =>
          ['High', 'Moderate'].includes(s.recyclability?.level)
        ).length;

        // Polymer frequencies
        const pCounts = {};
        const rCounts = {};
        const datesMap = {};

        userScans.forEach((s) => {
          pCounts[s.polymer] = (pCounts[s.polymer] || 0) + 1;

          const recLevel = s.recyclability?.level || 'Moderate';
          rCounts[recLevel] = (rCounts[recLevel] || 0) + 1;

          const dStr = new Date(s.createdAt).toISOString().split('T')[0];
          datesMap[dStr] = (datesMap[dStr] || 0) + 1;
        });

        let maxCount = 0;
        Object.entries(pCounts).forEach(([p, count]) => {
          if (count > maxCount) {
            maxCount = count;
            mostDetectedPolymer = p;
          }
        });

        polymerDistribution = Object.entries(pCounts).map(([name, value]) => ({ name, value }));
        recyclabilityDistribution = Object.entries(rCounts).map(([name, value]) => ({ name, value }));
        activityTimeline = Object.entries(datesMap)
          .map(([date, scans]) => ({ date, scans }))
          .sort((a, b) => a.date.localeCompare(b.date));
      }
    }

    return res.json({
      success: true,
      stats: {
        totalScans,
        mostDetectedPolymer,
        averageConfidence: avgConfidence,
        recyclableItems: recyclableCount,
        polymerDistribution,
        activityTimeline,
        recyclabilityDistribution,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
