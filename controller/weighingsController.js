const { requestError } = require('../utils');
const { subscriptionTypes } = require('../schemas/userSchemas');
const { Weighings } = require('../model');

const getWeighings = async (req, res, next) => {
  if (req.user.subscription === subscriptionTypes[0]) return next(requestError(401, 'Not authorized', 'NotQualified'));

  const searchParams = {};
  const { source } = req.query;

  if (source) searchParams['crop.source'] = source;

  const result = await Weighings.find(searchParams);
  // req.params
  // req.query

  // const {}

  res.json({ length: result.length, weighings: result });
};

const addWeighing = async (req, res, next) => {
  if (!req.user.isVerified) return next(requestError(401, 'Account not verified', 'NotVerified'));
  if (req.user.subscription !== subscriptionTypes[1]) return next(requestError(401, 'Not authorized', 'NotQualified'));

  const warnings = [];

  const weighingRecord = req.body;
  console.log({ weighingRecord });

  const {
    weighing: { brutto, tare, netto },
    harvesters,
  } = weighingRecord;
  const newNetto = parseInt(brutto) - parseInt(tare);
  const harvestersCount = harvesters.length;

  if (netto !== newNetto) {
    warnings.push('weighing.netto replaced with calculated value');
    weighingRecord.weighing = { ...weighingRecord.weighing, netto: newNetto };
  }

  if (harvestersCount > 0) {
    const nettoForEachHarvester = newNetto / harvestersCount;
    const harvestersClone = [];
    let totalWeight = 0;

    harvesters.forEach(harvester => {
      const { fullName, weight } = harvester;
      totalWeight += parseInt(weight);
      harvestersClone.push({ fullName, weight: nettoForEachHarvester });
    });

    if (totalWeight !== newNetto) {
      console.log({ totalWeight, newNetto });
      warnings.push('harvesters.weight replaced with calculated value');
      weighingRecord.harvesters = harvestersClone;
    }
  }

  console.log(weighingRecord);
  const result = await Weighings.create(weighingRecord);

  res.json({ ...(warnings.length && { warnings }), result });
};

module.exports = {
  getWeighings,
  addWeighing,
};
