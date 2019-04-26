const db = require('../models/');
const util = require('../util/util.js');
const bCrypt = require('bcryptjs');

module.exports.login = (req, res) => {
	db.User.findOne({
		where: { username: req.body.username },
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

module.exports.changepassword = (req, res) => {
	db.User.findOne({
		where: { username: req.body.username }
	}).then(user => {
		if (user) {
			bCrypt.compare(req.body.oldpassword, user.password, (err, matches) => {
				if (err) {
					util.print('Ups. Something went wrong comparing passwords.');
					util.print(err);
					// TODO
					res.redirect('/');
					return;
				}
				if (matches) {
					user.update({
						password: bCrypt.hashSync(req.body.newpassword, bCrypt.genSaltSync(8), null)
					}).then(result => {
						util.print('Password for user \'' + result.get('username') + '\' successfully changed.');
						res.redirect('/');
					}, err => {
						util.print(err);
						res.redirect('/error');
					});
				} else {
					// TODO, redirect & print error
					util.print('User ' + req.body.username + ' tried changing passwords, passwords did not match.');
					res.redirect('/error');
				}
			});
		}
		else {
			// TODO, redirect & display error
			util.print('User ' + req.body.username + ' does not exist');
			res.redirect('/error');
		}
	}, err => {
		// TODO, print/redirect
		util.print('Ups. Something went wrong changing the password.');
		util.print(err);
		res.redirect('/');
	});
};
