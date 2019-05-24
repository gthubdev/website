const util = require('../util/util.js');

module.exports.getStartpage = (req, res) => {
	res.render('landing.ejs', {
		loggedIn: util.isLoggedIn(req)
	});
};
