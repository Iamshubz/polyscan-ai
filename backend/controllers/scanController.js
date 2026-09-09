const Scan = require('../models/Scan');
const { uploadImageToCloud, deleteImageFromCloud } = require('../config/cloudinary');
const { analyzePlasticImage } = require('../services/geminiService');
const { getPolymerWithFallback } = require('../services/polymerService');
const { getIsConnected } = require('../config/db');

// Memory fallback store for scans
const memoryScans = [];

const analyzeScan = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload an image of a plastic object.' });
    }

    // 1. Upload image to Cloudinary or local storage
    const imageUrl = await uploadImageToCloud(req.file.buffer, req.file.originalname);

    // 2. Call Gemini Vision API
    const aiResult = await analyzePlasticImage(req.file.buffer, req.file.mimetype);

    // 3. Match polymer with knowledge base
    const polymerInfo = getPolymerWithFallback(aiResult.polymer);
    const detectedObjects = (aiResult.objects || [aiResult]).map((object) => {
      const info = getPolymerWithFallback(object.polymer);
      const confidenceLevel = object.confidence >= 80 ? 'High' : object.confidence >= 60 ? 'Moderate' : 'Low';
      return {
        ...object,
        polymer: info.code,
        polymerFullName: info.name,
        confidenceLevel,
        recyclability: info.recyclability,
        environmentalImpact: info.environmentalImpact,
        sustainabilityScore: info.sustainabilityScore,
        manufacturingProcesses: info.manufacturingProcesses,
        disposalRecommendation: info.disposalRecommendation,
        reuseIdeas: info.reuseIdeas,
      };
    });

    // 4. Determine confidence level text
    let confidenceLevel = 'Low';
    if (aiResult.confidence >= 80) {
      confidenceLevel = 'High';
    } else if (aiResult.confidence >= 60) {
      confidenceLevel = 'Moderate';
    }

    const userId = req.user.id;

    // 5. Construct full record
    const scanData = {
      userId,
      imageUrl,
      objectType: aiResult.objectType || 'Plastic Object',
      polymer: polymerInfo.code,
      polymerFullName: polymerInfo.name,
      confidence: aiResult.confidence,
      confidenceLevel,
      visualReasoning: aiResult.visualReasoning,
      visualFeatures: aiResult.visualFeatures || [],
      recyclability: polymerInfo.recyclability,
      environmentalImpact: polymerInfo.environmentalImpact,
      sustainabilityScore: polymerInfo.sustainabilityScore,
      manufacturingProcesses: polymerInfo.manufacturingProcesses,
      manufacturingProcess: aiResult.manufacturingProcess || 'UNKNOWN',
manufacturingConfidence: aiResult.manufacturingConfidence || 0,
manufacturingReasoning: aiResult.manufacturingReasoning || '',
      disposalRecommendation: polymerInfo.disposalRecommendation,
      reuseIdeas: polymerInfo.reuseIdeas,
      objects: detectedObjects,
      createdAt: new Date(),
    };

    let savedScan;

    if (getIsConnected()) {
      savedScan = await Scan.create(scanData);
    } else {
      savedScan = {
        _id: `scan_${Date.now()}_${Math.round(Math.random() * 1000)}`,
        ...scanData,
      };
      memoryScans.unshift(savedScan);
    }

    return res.status(201).json({
      success: true,
      scan: savedScan,
      polymerInfo,
    });
  } catch (error) {
    next(error);
  }
};

const getScans = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { polymer, search, sort = 'newest' } = req.query;

    if (getIsConnected()) {
      let query = { userId };

      if (polymer && polymer !== 'ALL') {
        query.polymer = polymer.toUpperCase();
      }

      if (search) {
        query.$or = [
          { objectType: { $regex: search, $options: 'i' } },
          { polymer: { $regex: search, $options: 'i' } },
          { polymerFullName: { $regex: search, $options: 'i' } },
        ];
      }

      const sortOption = sort === 'oldest' ? { createdAt: 1 } : { createdAt: -1 };

      const scans = await Scan.find(query).sort(sortOption);
      return res.json({ success: true, count: scans.length, scans });
    } else {
      let userScans = memoryScans.filter((s) => String(s.userId) === String(userId));

      if (polymer && polymer !== 'ALL') {
        userScans = userScans.filter((s) => s.polymer === polymer.toUpperCase());
      }

      if (search) {
        const queryLower = search.toLowerCase();
        userScans = userScans.filter(
          (s) =>
            s.objectType.toLowerCase().includes(queryLower) ||
            s.polymer.toLowerCase().includes(queryLower) ||
            s.polymerFullName.toLowerCase().includes(queryLower)
        );
      }

      userScans.sort((a, b) => {
        return sort === 'oldest'
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      });

      return res.json({ success: true, count: userScans.length, scans: userScans });
    }
  } catch (error) {
    next(error);
  }
};

const getScanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (getIsConnected()) {
      const scan = await Scan.findOne({ _id: id, userId });
      if (!scan) {
        return res.status(404).json({ success: false, message: 'Scan not found.' });
      }

      const polymerInfo = getPolymerWithFallback(scan.polymer);
      return res.json({ success: true, scan, polymerInfo });
    } else {
      const scan = memoryScans.find((s) => String(s._id) === String(id) && String(s.userId) === String(userId));
      if (!scan) {
        return res.status(404).json({ success: false, message: 'Scan not found.' });
      }

      const polymerInfo = getPolymerWithFallback(scan.polymer);
      return res.json({ success: true, scan, polymerInfo });
    }
  } catch (error) {
    next(error);
  }
};

const deleteScan = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (getIsConnected()) {
      const scan = await Scan.findOne({ _id: id, userId });
      if (!scan) {
        return res.status(404).json({ success: false, message: 'Scan not found.' });
      }

      await deleteImageFromCloud(scan.imageUrl);
      await Scan.deleteOne({ _id: id });

      return res.json({ success: true, message: 'Scan removed successfully.' });
    } else {
      const index = memoryScans.findIndex(
        (s) => String(s._id) === String(id) && String(s.userId) === String(userId)
      );

      if (index === -1) {
        return res.status(404).json({ success: false, message: 'Scan not found.' });
      }

      const [removed] = memoryScans.splice(index, 1);
      await deleteImageFromCloud(removed.imageUrl);

      return res.json({ success: true, message: 'Scan removed successfully.' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeScan,
  getScans,
  getScanById,
  deleteScan,
  memoryScans,
};
