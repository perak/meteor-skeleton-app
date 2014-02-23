var SITE_NAME = "Login example";

Handlebars.registerHelper("siteName", function() {
	return SITE_NAME;
});

Handlebars.registerHelper("userFullName", function() {
	return Meteor.user().profile.name;
});

Handlebars.registerHelper("isUserVerified", function() {
	return Meteor.user() && Meteor.user().emails[0].verified;
});

Handlebars.registerHelper("menuItemClass", function(routeName) {
	if(!Router.current(true)) return "";
	if(!Router.routes[routeName]) return "";

	var current_path = Router.current(true).path;
	var route_path = Router.routes[routeName].path();

	if(route_path == "/")
		return current_path == route_path ? "active" : "";

	return current_path.indexOf(route_path) == 0 ? "active" : "";
});