const jwt = require('jsonwebtoken');
const { User, Constants } = require('../model');
const { requestError } = require('../utils');

module.exports = async (req, res, next) => {
  if (!req.headers.authorization) return next(requestError(401, 'Not authorized', 'NoAuthHeader'));

  const [authScheme, token] = req.headers.authorization.split(' ');
  if (authScheme !== 'Bearer') return next(requestError(401, 'Auth scheme unsupported', 'InvalidHeader'));
  if (!token) return next(requestError(401, 'Not authorized', 'InvalidHeader'));

  const decodedUser = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedUser?._id || !decodedUser?.email) return next(requestError(401, 'Not authorized', 'TokenInvalid'));

  const dbUser = await User.findById(decodedUser._id);
  if (!dbUser) return next(requestError(401, 'Not authorized', 'NoTokenUser'));
  if (!dbUser.isVerified) return next(requestError(401, 'Account not verified', 'NotVerified'));

  if (dbUser.token !== token) {
    await User.findByIdAndUpdate(dbUser._id, { token: '' });
    return next(requestError(401, 'Not authorized', 'TokenMismatch'));
  }

  const subscriptionsList = (await Constants.findOne({ type: 'subscriptions' })).data;

  if (subscriptionsList.indexOf(dbUser.subscription) === -1) {
    dbUser.subscription = subscriptionsList[0];
    await User.findByIdAndUpdate(dbUser._id, { subscription: subscriptionsList[0] });
  }

  req.user = dbUser;

  return next();
};
