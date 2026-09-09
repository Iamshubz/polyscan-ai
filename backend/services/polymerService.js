const fs = require('fs');
const path = require('path');

const polymersPath = path.join(__dirname, '..', 'data', 'polymers.json');
let polymersData = [];

try {
  const rawData = fs.readFileSync(polymersPath, 'utf8');
  polymersData = JSON.parse(rawData);
} catch (err) {
  console.error('[PolymerService Error] Could not load polymers.json:', err.message);
}

const getAllPolymers = () => polymersData;

const getPolymerByCode = (code) => {
  if (!code) return null;
  const targetCode = String(code).trim().toUpperCase();
  return polymersData.find((p) => p.code === targetCode) || null;
};

const getPolymerWithFallback = (code) => {
  const polymer = getPolymerByCode(code);
  if (polymer) return polymer;

  return {
    code: 'UNKNOWN',
    name: 'Unclassified Plastic / Polymer',
    resinCode: 7,
    description: 'Visual analysis could not conclusively map this object to a standard resin category.',
    commonUses: ['Miscellaneous consumer goods', 'Composite materials'],
    recyclability: {
      level: 'Low',
      description: 'Consult local municipal guidelines for unclassified plastic sorting.'
    },
    manufacturingProcesses: ['Varied Molding Methods'],
    disposalRecommendation: 'Check local waste authority guidelines. Consider specialized sorting or general waste.',
    reuseIdeas: ['General Household Storage'],
    environmentalImpact: {
      level: 'Moderate',
      description: 'Non-standard resin composition requiring careful disposal.'
    },
    sustainabilityScore: 5.0
  };
};

module.exports = {
  getAllPolymers,
  getPolymerByCode,
  getPolymerWithFallback,
};
