const nodemailer = require('nodemailer');
const requestError = require('./requestError');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateRegistrationEmail = ({ email, verificationToken }) => {
  const verificationLink = `http://127.0.0.1:${process.env.SERVER_PORT}/api/users/verify/${verificationToken}`;
  const message = {
    from: 'phonebook@goit_hw.com',
    to: email,
    subject: 'Verify your account',
    text: `
    Welcome. 
    
    Please verity your e-mail address.
    Visit this site: ${verificationLink}`,
    html: `
    <h1>Welcome</h1>
    <p>Please verify your e-mail address.</p>
    <p>Visit this site: <a href="${verificationLink}">${verificationLink}</a></p>`,
  };

  return message;
};

const generateWelcomeEmail = ({ email }) => {
  const message = {
    from: 'phonebook@goit_hw.com',
    to: email,
    subject: 'Welcome to our service',
    text: `Welcome to our service.`,
    html: `<h1>Welcome to our service</h1>`,
  };

  return message;
};

const sendEmail = async message => {
  try {
    await transporter.sendMail(message);
    return;
  } catch (err) {
    console.error('Verification e-mail not sent. Error:', err);
    return requestError(500, 'Verification not possible', 'VerifyEmailNotSent');
  }
};

const verify = () => {
  transporter.verify(error => {
    if (error) console.error('email system error:', error);
    else console.log('Nodemailer is ready');
  });
};

module.exports = {
  verify,
  generateRegistrationEmail,
  generateWelcomeEmail,
  sendEmail,
};
