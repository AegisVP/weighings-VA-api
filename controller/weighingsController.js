const { requestError } = require('../utils');
const { Weighings, Constants } = require('../model');

const getWeighings = async (req, res, next) => {
  const subscriptionTypes = await Constants.findOne({ type: 'subscriptions' });
  if (req.user.subscription === subscriptionTypes[0]) return next(requestError(401, 'Not authorized', 'NotQualified'));

  // const searchParams = {};
  // const { source } = req.query;

  // if (source) searchParams['crop.source'] = source;

  // const result = await Weighings.find(searchParams);
  // req.params
  // req.query

  // const {}

  // res.json({ length: result.length, weighings: result });
  res.json({ message: 'getWeighings ran' });
};

const addWeighing = async (req, res, next) => {
  const warnings = [];
  const weighingRecord = req.body;
  const allConstants = await Constants.find();
  const subscriptionsList = allConstants.find(constant => constant.type === 'subscriptions').data;
  const driversList = allConstants.find(constant => constant.type === 'drivers').data;
  const sourcesList = allConstants.find(constant => constant.type === 'sourcesList').data;
  const destinationsList = allConstants.find(constant => constant.type === 'destinationsList').data;
  const harvestersList = allConstants.find(constant => constant.type === 'harvesters').data;
  const cropsList = allConstants.find(constant => constant.type === 'crops').data;

  if (req.user.subscription !== subscriptionsList[1]) return next(requestError(401, 'Not authorized', 'NotQualified'));

  if (driversList.indexOf(weighingRecord.auto.driver) === -1) return next(requestError(400, 'Invalid driver name', 'NoSuchName'));
  if (cropsList.indexOf(weighingRecord.crop.name) === -1) return next(requestError(400, 'Invalid crop name', 'NoSuchName'));
  if (sourcesList.indexOf(weighingRecord.crop.source) === -1) return next(requestError(400, 'Invalid crop source', 'NoSuchName'));
  if (destinationsList.indexOf(weighingRecord.crop.destination) === -1) return next(requestError(400, 'Invalid crop destination', 'NoSuchName'));

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

    for (const { name, weight } of harvesters) {
      if (harvestersList.indexOf(name) === -1) return next(requestError(400, `Invalid harvester name ${name}`, 'NoSuchName'));

      totalWeight += parseInt(weight);
      harvestersClone.push({ name, weight: nettoForEachHarvester });
    }

    if (totalWeight !== newNetto) {
      warnings.push('harvesters.weight replaced with calculated value');
      weighingRecord.harvesters = harvestersClone;
    }
  }

  weighingRecord.createdBy = req.user.email;

  console.log(weighingRecord);
  const result = await Weighings.create(weighingRecord);

  return res.json({ ...(warnings.length && { warnings }), result });
};

module.exports = {
  getWeighings,
  addWeighing,
};
