Router.configure({
	layoutTemplate: 'layout',
	notFoundTemplate: 'not_found',
	loadingTemplate: 'loading',
});

Router.ensureLogged = function() {
	if(!Meteor.user())
		this.redirect("home_public");
	else 
		if(!Meteor.user().emails[0].verified)
			this.redirect("unverified");
}

Router.ensureNotLogged = function() {
	if(Meteor.user())
		this.redirect("home_private");
}

Router.ensureNotVerified = function() {
	if(Meteor.user() && Meteor.user().emails[0].verified)
		this.redirect("home_private");
}


if (Meteor.isClient) {
	Router.before(Router.ensureNotLogged, {only: ['home_public', 'login', 'register', 'forgot_password', 'reset_password' ]});
	Router.before(Router.ensureNotVerified, {only: ['unverified', 'verify_email']});
	Router.before(Router.ensureLogged, {only: ['home_private', 'logout', 'help']});
}

Router.map(function () {

	this.route("not_found", { path: "/not_found", template: "not_found" });
	this.route("home_public", { path: "/", template: "home_public" });
	this.route("unverified", { path: "/unverified", template: "unverified" });
	this.route("login", { path: "/login", template: "login" });
	this.route("register", { path: "/register", template: "register" });

	this.route("verify_email", {
		path: "/verify_email/:token",
		template: "verify_email",
		action: function() {
			var me = this;

			// ensuseNotVerified is doing the same check in "before" handler, 
			// but this doesn't work with two browser tabs since Accounts.verifyEmail callback is async
			if(Meteor.user() && Meteor.user().emails[0].verified)
				me.redirect("home_private");
			else
			{
				Accounts.verifyEmail(this.params.token, function(err) {
					if(err)
					{
						Session.set("verifyEmailErrorMessage", err.message);
						me.render();
					}
					else
						me.redirect("home_private");
				});
				this.render();
			}
		}
	});

	this.route("forgot_password", { path: "/forgot_password", template: "forgot_password" });

	this.route("reset_password", { 
		path: "/reset_password/:token", 
		template: "reset_password", data: function() {
			return { resetPasswordToken: this.params.token }
		}
	});

	this.route("logout", {
		path: "/logout",
		action: function() {
			var me = this;
			Meteor.logout(function(err) {
				if(err)
					alert(err);
				me.redirect("home_public");
			});
		}
	});

	this.route("home_private", { path: "/home", template: "home_private" });
	this.route("help", { path: "/help", template: "help" });
});
