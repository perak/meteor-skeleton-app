isValidEmail = function(value) {
    var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (filter.test(value)) {
        return true;
    }
    return false;
};

isValidPassword = function(value, min_length) {
	if(!value || value == "" || value.length < min_length)
		return false;
	return true;
}
