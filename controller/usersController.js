const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');

const { requestError, mailInterface } = require('../utils');
const { User } = require('../model');

const createNewVerificationToken = () => uuid();

async function registerUser(req, res, next) {
  const { email } = req.body;
  const verificationToken = createNewVerificationToken();

  if (await User.findOne({ email })) return next(requestError(409, 'Email is already in use', 'Conflict'));

  const newUser = new User(req.body);
  newUser.verificationToken = verificationToken;
  await newUser.cryptPassword();
  await newUser.save();

  await mailInterface.sendEmail(mailInterface.generateRegistrationEmail({ email, verificationToken }));

  return res.status(201).json({ user: { email, subscription: newUser.subscription } });
}

async function loginUser(req, res, next) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return next(requestError(401, 'Unable to login', 'NoSuchUser'));

  if (!(await bcrypt.compare(password, user.password))) return next(requestError(401, 'Unable to login', 'WrongPassword'));

  const { _id, subscription = false } = user;

  if (!user.isVerified) return next(requestError(401, 'Verify your email', 'EmailNotVerified'));

  const token = jwt.sign({ _id, email, subscription }, process.env.JWT_SECRET);
  await User.findByIdAndUpdate(_id, { token });

  return res.json({ token, user: { email, subscription } });
}

async function logoutUser(req, res, next) {
  await User.findByIdAndUpdate(req.user._id, { token: '' });

  return res.status(204).send();
}

async function currentUser(req, res, next) {
  return res.json({
    email: req.user.email,
    subscription: req.user.subscription,
  });
}

async function updateSubscription(req, res, next) {  // TODO: change logic
  // const { user, subscription } = req.body;

  // const result = await User.findByIdAndUpdate(
  // 	req.user._id,
  // 	{ subscription },
  // 	{ new: true }
  // );

  // return res.json({ email: result.email, subscription: result.subscription });
  return res.json({ message: 'TODO: rewrite logic to change subscription if authorized as owner' });
}

const verifyUserEmail = async (req, res, next) => {
  const { verificationToken } = req.params;

  const user = await User.findOneAndUpdate({ verificationToken }, { isVerified: true, verificationToken: '' }, { new: true });
  if (!user) return next(requestError(404, 'User not found', 'NoVerifyToken'));

  mailInterface.sendEmail(mailInterface.generateWelcomeEmail({ email: user.email }));
  return res.status(200).json({ message: 'Verification successful' });
};

const resendVerificationEmail = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(requestError(404, 'User not found', 'NoUserFound'));

  const { isVerified, verificationToken } = user;
  if (isVerified) return next(requestError(400, 'Already verified', 'UserIsVerified'));

  mailInterface.sendEmail(mailInterface.generateRegistrationEmail({ email, verificationToken }));
  res.json({ message: 'Verification email sent' });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  currentUser,
  updateSubscription,
  verifyUserEmail,
  resendVerificationEmail,
};
