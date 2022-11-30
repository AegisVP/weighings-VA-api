const { requestError } = require('../utils');
const { subscriptionTypes } = require('../schemas/userSchemas');
const { Weighing } = require('../model');

const getWeighings = async (req, res, next) => {
  if (req.user.subscription === subscriptionTypes[0]) return next(requestError(401, 'Not authorized', 'NotQualified'));

  // req.params
  // req.query

  // const {}

  res.json({ message: 'getWeighings' });
};

const addWeighing = async (req, res, next) => {
  if (!req.user.isverified) return next(requestError(401, 'Account not verified', 'NotVerified'));
  if (req.user.subscription !== subscriptionTypes[1]) return next(requestError(401, 'Not authorized', 'NotQualified'));

  const weighing = req.body;
  console.log({ weighing });

  const result = await Weighing.create(weighing);

  res.json({ result });
};

module.exports = {
  getWeighings,
  addWeighing,
};
