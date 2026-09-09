const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    objectType: {
      type: String,
      required: true,
      default: 'Plastic Item',
    },
    polymer: {
      type: String,
      required: true,
      uppercase: true,
      index: true,
    },
    polymerFullName: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    confidenceLevel: {
      type: String,
      enum: ['Low', 'Moderate', 'High'],
      required: true,
    },
    visualReasoning: {
      type: String,
      default: '',
    },
    visualFeatures: [
      {
        type: String,
      },
    ],
    recyclability: {
      level: { type: String, default: 'Moderate' },
      description: { type: String, default: '' },
    },
    environmentalImpact: {
      level: { type: String, default: 'Moderate' },
      description: { type: String, default: '' },
    },
    sustainabilityScore: {
      type: Number,
      default: 7.0,
    },
    manufacturingProcess: {
  type: String,
  default: 'UNKNOWN',
},

manufacturingConfidence: {
  type: Number,
  min: 0,
  max: 100,
  default: 0,
},

manufacturingReasoning: {
  type: String,
  default: '',
},

manufacturingConfidence: {
  type: Number,
  min: 0,
  max: 100,
  default: 0
},

manufacturingReasoning: {
  type: String,
  default: ''
},
    disposalRecommendation: {
      type: String,
      default: '',
    },
    reuseIdeas: [
      {
        type: String,
      },
    ],
    objects: [
      {
        objectType: { type: String, default: 'Unknown Plastic Object' },
        polymer: { type: String, default: 'UNKNOWN' },
        polymerFullName: { type: String, default: 'Unknown polymer' },
        confidence: { type: Number, min: 0, max: 100, default: 0 },
        confidenceLevel: { type: String, enum: ['Low', 'Moderate', 'High'], default: 'Low' },
        visualReasoning: { type: String, default: '' },
        visualFeatures: [{ type: String }],
        manufacturingProcess: { type: String, default: 'UNKNOWN' },
        manufacturingConfidence: { type: Number, min: 0, max: 100, default: 0 },
        manufacturingReasoning: { type: String, default: '' },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scan', scanSchema);
