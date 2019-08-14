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
					util.error(req, res, err);
					return;
				}
				if (matches) {
					util.print('User ' + req.body.username + ', password matched');
					req.session.user = user.id;
					res.status(200).send();
				} else {
					util.print('User ' + req.body.username + ', password did not match');
					res.status(403).send();
				}
			});
		} else {
			util.print('User ' + req.body.username + ' does not exist');
			res.status(403).send();
		}
	}, err => {
		util.error(req, res, err);
	});

};

module.exports.logout = (req, res) => {
	res.clearCookie('connect.sid');
	req.session.destroy();
	res.status(200).send();
};

module.exports.changepassword = (req, res) => {
	db.User.findOne({
		where: { username: req.body.username }
	}).then(user => {
		if (user) {
			bCrypt.compare(req.body.oldpassword, user.password, (err, matches) => {
				if (err) {
					util.error(req, res, err);
					return;
				}
				if (matches) {
					user.update({
						password: bCrypt.hashSync(req.body.newpassword, bCrypt.genSaltSync(8), null)
					}).then(result => {
						util.print('Password for user \'' + result.get('username') + '\' successfully changed.');
						res.status(200).send();
					}, err => {
						util.error(req, res, err);
					});
				} else {
					// TODO, redirect & print error
					util.print('User ' + req.body.username + ' tried changing passwords, passwords did not match.');
					res.status(401).send('Wrong user/password combination.');
				}
			});
		}
		else {
			util.print('User ' + req.body.username + ' does not exist');
			res.status(401).send('Wrong user/password combination.');
		}
	}, err => {
		util.error(req, res, err);
	});
};
