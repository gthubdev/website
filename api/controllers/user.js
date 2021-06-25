const bCrypt = require('bcryptjs');
const { User } = require('../models');
const util = require('../util/util');

module.exports.createUser = async (req, res) => {
	const newuser = req.body.user;

	if (!newuser || !newuser.username || !newuser.password || !newuser.name) {
		res.status(422).send();
		return;
	}

	// constraints for username:
	// length >= 3 and <= 20
	// no spaces
	// only lower-case alphanumerical characters
	if (newuser.username.includes(' ') ||
		newuser.username.length < 3 ||
		newuser.username.length > 20 ||
		!newuser.username.match(/^[0-9a-z]+$/)
	) {
		res.status(422).send('Invalid username');
		return;
	}

	// constraints for password:
	// TODO

	try {
		const tmp = {
			username: req.body.user.username,
			password: bCrypt.hashSync(req.body.user.password, bCrypt.genSaltSync(8)),
			name: req.body.name
		};

		const user = await User.create(tmp);
		util.print('User \'' + user.username + '\' created');
		res.status(200).send();
	} catch (err) {
		util.error(req, res, err);
	}
};
