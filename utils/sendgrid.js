const sgMail = require('@sendgrid/mail');

const requestError = require('./requestError');
const { API_HOST, SENDGRID_API_KEY } = require('../config');

const generateRegistrationEmail = ({ name, email, verificationToken }) => {
  const verificationLink = `${API_HOST}/api/users/verify/${verificationToken}`;
  const message = {
    from: 'vlad@pysarenko.com',
    to: 'vlad@pysarenko.com',
    subject: 'Verify new Vital-AGRO Weighings account',
    text: `
    Welcome. 
    
    Please verity new e-mail address ${email} for ${name}.
    Visit this site: ${verificationLink}`,
    html: `
    <h1>Welcome</h1>

    <p>Please verity new e-mail address ${email} for ${name}..</p>
    <p>Visit this site: <a href="${verificationLink}">${verificationLink}</a></p>`,
  };

  return message;
};

const generateWelcomeEmail = ({ email }) => {
  const message = {
    from: 'vlad@pysarenko.com',
    to: email,
    subject: 'Welcome to Vital-AGRO Weighing portal',
    text: `Welcome to our service.`,
    html: `<h1>Welcome to our service</h1>`,
  };

  return message;
};

const sendEmail = async message => {
  sgMail.setApiKey(SENDGRID_API_KEY);

  try {
    await sgMail.send(message);
    return;
  } catch (err) {
    console.error('Verification e-mail not sent. Error:', err);
    return requestError(500, 'Verification not possible', 'VerifyEmailNotSent');
  }
};

const verify = () => {
  console.log('SendGrid is ready');
};

module.exports = {
  verify,
  generateRegistrationEmail,
  generateWelcomeEmail,
  sendEmail,
};
