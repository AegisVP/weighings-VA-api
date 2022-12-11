const { requestError } = require('../utils');
const { Weighings } = require('../model');
const { subscriptionsList, driversList, sourcesList, destinationsList, harvestersList, cropsList } = require('../utils').allConstants;

/*

const enteredDate = new Date(weighingRecord.date);
const [enteredYear, enteredMonth, enteredDay] = [enteredDate.getFullYear(), enteredDate.getMonth(), enteredDate.getDate()];

console.log({ enteredDate, enteredDay, enteredMonth, enteredYear });
  
*/

const getWeighings = async (req, res, next) => {
  if (req.user.subscription === subscriptionsList[0]) return next(requestError(401, 'Not authorized', 'NotQualified'));

  const searchParams = {};
  const { source, driver, date } = req.query;
  let { year, month, day } = req.query;

  if (!year || !month || !day) {
    const parseDate = new Date(date || Date.now());
    [year, month, day] = [parseDate.getFullYear(), parseDate.getMonth() + 1, parseDate.getDate()];
  }

  year = parseInt(year);
  month = parseInt(month);
  day = parseInt(day);

  searchParams.date = { year, month, day };
  if (source) searchParams['crop.source'] = source;
  if (driver) searchParams['auto.driver'] = driver;
  // if (source) searchParams['crop.source'] = source;
  // if (source) searchParams['crop.source'] = source;

  console.log({ searchParams });
  const result = await Weighings.find(searchParams);

  res.json({ length: result.length, weighings: result });
  // res.json({ message: 'getWeighings ran' });
};

const addWeighing = async (req, res, next) => {
  const warnings = [];
  const weighingRecord = req.body;

  if (req.user.subscription !== subscriptionsList[1]) return next(requestError(401, 'Not authorized', 'NotQualified'));

  if (!driversList.includes(weighingRecord.auto.driver)) return next(requestError(400, 'Invalid driver name', 'NoSuchName'));
  if (!cropsList.includes(weighingRecord.crop.name)) return next(requestError(400, 'Invalid crop name', 'NoSuchName'));
  if (!sourcesList.includes(weighingRecord.crop.source)) return next(requestError(400, 'Invalid crop source', 'NoSuchName'));
  if (!destinationsList.includes(weighingRecord.crop.destination)) return next(requestError(400, 'Invalid crop destination', 'NoSuchName'));

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
      if (!harvestersList.includes(name)) return next(requestError(400, `Invalid harvester name ${name}`, 'NoSuchName'));

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
  // const result = weighingRecord;
  const result = await Weighings.create(weighingRecord);

  return res.json({ ...(warnings.length && { warnings }), result });
};

module.exports = {
  getWeighings,
  addWeighing,
};
