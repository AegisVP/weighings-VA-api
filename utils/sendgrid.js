const sgMail = require("@sendgrid/mail");

const requestError = require("./requestError");

const generateRegistrationEmail = ({ email, verificationToken }) => {
	const verificationLink = `http://127.0.0.1:${process.env.SERVER_PORT}/api/users/verify/${verificationToken}`;
	const message = {
		from: "vlad@pysarenko.com",
		to: email,
		subject: "Verify your account",
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
		from: "vlad@pysarenko.com",
		to: email,
		subject: "Welcome to our service",
		text: `Welcome to our service.`,
		html: `<h1>Welcome to our service</h1>`,
	};

	return message;
};

const sendEmail = async (message) => {
	sgMail.setApiKey(process.env.SENDGRID_API_KEY);

	try {
		await sgMail.send(message);
		return;
	} catch (err) {
		console.error("Verification e-mail not sent. Error:", err);
		return requestError(500, "Verification not possible", "VerifyEmailNotSent");
	}
};

const verify = () => {
	console.log("SendGrid is ready");
};

module.exports = {
	verify,
	generateRegistrationEmail,
	generateWelcomeEmail,
	sendEmail,
};
