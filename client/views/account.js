var page_session = new ReactiveDict();

page_session.set("registerErrorMessage", "");
page_session.set("loginErrorMessage", "");
page_session.set("forgotPasswordErrorMessage", "");
page_session.set("resetPasswordErrorMessage", "");

// this is set by router so I made it global
Session.set("verifyEmailErrorMessage", "");

Template.register.events({
	'submit #form_register' : function(e, t) {
		e.preventDefault();

		var submit_button = $(t.find(":submit"));

		var register_name = t.find('#register_name').value.trim();
		var register_email = t.find('#register_email').value.trim();
		var register_password = t.find('#register_password').value;

		// check name
		if(register_name == "")
		{
			page_session.set("registerErrorMessage", "Please enter your name.");
			t.find('#register_name').focus();
			return false;			
		}

		// check email
		if(!isValidEmail(register_email))
		{
			page_session.set("registerErrorMessage", "Please enter valid e-mail address.");
			t.find('#register_email').focus();
			return false;			
		}

		// check password
		var min_password_len = 6;
		if(!isValidPassword(register_password, min_password_len))
		{
			page_session.set("registerErrorMessage", "Your password must be at least " + min_password_len + " characters long.");
			t.find('#register_password').focus();
			return false;						
		}

		submit_button.button("loading");

		Accounts.createUser({email: register_email, password : register_password, profile: { name: register_name }}, function(err) {
			submit_button.button('reset');
			if(err)
				page_session.set("registerErrorMessage", err.message);
			else
				page_session.set("registerErrorMessage", "");
		});
		return false;
	}
});

Template.register.helpers({
	errorMessage: function() {
		return page_session.get("registerErrorMessage");
	}
});

Template.login.events({
	'submit #form_login' : function(e, t) {
		e.preventDefault();

		var submit_button = $(t.find(":submit"));

		var login_email = t.find('#login_email').value.trim();
		var login_password = t.find('#login_password').value;

		// check email
		if(!isValidEmail(login_email))
		{
			page_session.set("loginErrorMessage", "Please enter your e-mail address.");
			t.find('#login_email').focus();
			return false;
		}

		// check password
		if(login_password == "")
		{
			page_session.set("loginErrorMessage", "Please enter your password.");
			t.find('#login_email').focus();
			return false;
		}

		submit_button.button("loading");

		Meteor.loginWithPassword(login_email, login_password, function(err) {
			submit_button.button('reset');
			if (err)
			{
				page_session.set("loginErrorMessage", err.message);
				return false;
			}
			else
				page_session.set("loginErrorMessage", "");
		});
		return false; 
	}
});

Template.login.helpers({
	errorMessage: function() {
		return page_session.get("loginErrorMessage");
	}
});

Template.forgot_password.events({
	// send reset password link
	'submit #form_forgot_password' : function(e, t) {
		e.preventDefault();

		var submit_button = $(t.find(":submit"));
		var reset_email = t.find('#reset_email').value.trim();

		// check email
		if(!isValidEmail(reset_email))
		{
			page_session.set("forgotPasswordErrorMessage", "Please enter your e-mail address.");
			t.find('#reset_email').focus();
			return false;
		}

		submit_button.button("loading");
		Accounts.forgotPassword({email: reset_email}, function(err) {
			submit_button.button("reset");
			if (err)
				page_session.set("forgotPasswordErrorMessage", err.message);
			else
			{
				page_session.set("forgotPasswordErrorMessage", "");
				page_session.set("resetPasswordSent", true);				
			}
		});

		return false; 
	},

	// button "OK" in information box after reset password email is sent
	'click #reset_password_sent' : function(e, t) {
		page_session.set("resetPasswordSent", false);
		return true;
	}

});

Template.forgot_password.helpers({
	errorMessage: function() {
		return page_session.get("forgotPasswordErrorMessage");
	},

	resetPasswordSent: function() {
		return page_session.get("resetPasswordSent");
	}
});


Template.reset_password.events({
	// change password
	'submit #form_reset_password' : function(e, t) {
		e.preventDefault();

		var submit_button = $(t.find(":submit"));
		var new_password = t.find('#new_password').value;
		var new_password_confirm = t.find('#new_password_confirm').value;

		// check password
		var min_password_len = 6;
		if(!isValidPassword(new_password, min_password_len))
		{
			page_session.set("resetPasswordErrorMessage", "Your password must be at least " + min_password_len + " characters long.");
			t.find('#new_password').focus();
			return false;						
		}

		if(new_password != new_password_confirm)
		{
			page_session.set("resetPasswordErrorMessage", "Your password and confirm password doesn't match.");
			t.find('#new_password_confirm').focus();
			return false;
		}

		submit_button.button("loading");

		debugger;
		Accounts.resetPassword(this.resetPasswordToken, new_password, function(err) {
			submit_button.button("reset");
			if (err)
				page_session.set("resetPasswordErrorMessage", err.message);
			else
				page_session.set("resetPasswordErrorMessage", "");
		});

		return false; 
	}
});

Template.reset_password.helpers({
	errorMessage: function() {
		return page_session.get("resetPasswordErrorMessage");
	}
});

Template.verify_email.helpers({
	errorMessage: function() {
		return Session.get("verifyEmailErrorMessage");
	}
});
