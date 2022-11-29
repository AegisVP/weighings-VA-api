module.exports = {
  tryCatchWrapper: require('./tryCatchWrapper'),
  requestError: require('./requestError'),
  // mailInterface: require('./nodemailer'),
  mailInterface: require('./sendgrid'),
};
