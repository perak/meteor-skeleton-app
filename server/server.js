var SITE_NAME = "Login example";
var SITE_MAIL = "<your_username>@gmail.com";
var SITE_MAIL_URL = "smtp://<your_username>%40gmail.com:<your_password>@smtp.gmail.com:465/";

Meteor.startup(function () {

	// SMTP settings

	process.env.MAIL_URL = SITE_MAIL_URL;


	// account email settings

	Accounts.emailTemplates.siteName = SITE_NAME;
	Accounts.emailTemplates.from = SITE_NAME + "<" + SITE_MAIL + ">";


	// account config

	Accounts.config({
	    sendVerificationEmail: true, 
	    forbidClientAccountCreation: false
	})


	// reset password e-mail subject and body

	Accounts.emailTemplates.resetPassword.subject = function (user) {
	    return SITE_NAME + " password reset";
	};

	Accounts.emailTemplates.resetPassword.text = function (user, url) {
		return "Hello " + user.profile.name + "\n\n"
			+ "To reset your password, simply click the link below:\n\n"
		 	+ url + "\n\n";
		 	+ "Thanks.";
	};

	// Changed URL format to avoid hashbangs

	Accounts.urls.resetPassword = function (token) {
		return Meteor.absoluteUrl('reset_password/' + token);
	};

	Accounts.urls.verifyEmail = function (token) {
		return Meteor.absoluteUrl('verify_email/' + token);
	};
});
