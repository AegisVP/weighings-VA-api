const { requestError } = require('../utils');
const { Constants, Auto } = require('../model');

const getAutos = async (req, res, next) => {
  const result = await Auto.find();
  if (!result) return next(requestError(404, 'Not found', 'NoConstant'));
  return res.status(200).json(result);
};

const getSubscriptions = async (req, res, next) => {
  const result = await Constants.findOne({ type: 'subscriptions' });
  if (!result) return next(requestError(404, 'Not found', 'NoConstant'));
  return res.status(200).json([...result.data]);
};

const getDrivers = async (req, res, next) => {
  const result = await Constants.findOne({ type: 'drivers' });
  if (!result) return next(requestError(404, 'Not found', 'NoConstant'));
  return res.status(200).json([...result.data]);
};

const getHarvesters = async (req, res, next) => {
  const result = await Constants.findOne({ type: 'harvesters' });
  if (!result) return next(requestError(404, 'Not found', 'NoConstant'));
  return res.status(200).json([...result.data]);
};

const getSources = async (req, res, next) => {
  const result = await Constants.findOne({ type: 'sourcesList' });
  if (!result) return next(requestError(404, 'Not found', 'NoConstant'));
  return res.status(200).json([...result.data]);
};

const getDestinations = async (req, res, next) => {
  const result = await Constants.findOne({ type: 'destinationsList' });
  if (!result) return next(requestError(404, 'Not found', 'NoConstant'));
  return res.status(200).json([...result.data]);
};

const getCrops = async (req, res, next) => {
  const result = await Constants.findOne({ type: 'crops' });
  if (!result) return next(requestError(404, 'Not found', 'NoConstant'));
  return res.status(200).json([...result.data]);
};

module.exports = { getSubscriptions, getAutos, getDrivers, getHarvesters, getSources, getDestinations, getCrops };
