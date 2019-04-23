const db = require('../models/');
const util = require('../util/util.js');
const bCrypt = require('bcryptjs');

module.exports.login = (req, res) => {
	db.User.findOne({
		where: {
			username: req.body.username
		},
		include: [
			{ model: db.Usertype }
		]
	}).then(user => {
		if (user) {
			bCrypt.compare(req.body.password, user.password, (err, matches) => {
				if (err) {
					util.print('Ups. Something went wrong comparing passwords.');
					util.print(err);
					// TODO
					res.redirect('/', {loggedIn: false});
					return;
				}
				if (matches) {
					// TODO, redirect to somewhere
					util.print('User ' + req.body.username + ', password matched');
					req.session.user = user;
					res.redirect('/');
				} else {
					// TODO, redirect & print error
					util.print('User ' + req.body.username + ', password did not match');
					res.redirect('/error');
				}
			});
		} else {
			// TODO, redirect & display error
			util.print('User ' + req.body.username + ' does not exist');
			res.redirect('/error');
		}
	}, err => {
		// TODO, print/redirect
		util.print('Ups. Something went wrong logging in.');
		util.print(err);
		res.redirect('/');
	});

};

module.exports.logout = (req, res) => {
	res.clearCookie('connect.sid');
	req.session.destroy();
	res.redirect('/');
};
