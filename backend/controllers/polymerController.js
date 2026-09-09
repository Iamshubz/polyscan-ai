const { getAllPolymers, getPolymerByCode, getPolymerWithFallback } = require('../services/polymerService');

const getPolymers = (req, res) => {
  const polymers = getAllPolymers();
  res.json({ success: true, count: polymers.length, polymers });
};

const getPolymerByCodeHandler = (req, res) => {
  const { code } = req.params;
  const polymer = getPolymerWithFallback(code);
  res.json({ success: true, polymer });
};

module.exports = {
  getPolymers,
  getPolymerByCode: getPolymerByCodeHandler,
};
