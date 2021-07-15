const bCrypt = require('bcryptjs');
const { User } = require('../models');
const util = require('../util/util');
const auth = require('../middleware/auth');

module.exports.create = async (req, res) => {
	const newuser = req.body.user;

	if (!newuser || !newuser.username || !newuser.password || !newuser.name) {
		res.status(422).send();
		return;
	}

	// constraints for username:
	// length >= 3 and <= 20
	// no spaces
	// one dash allowed, but not as first or last character
	// only lower-case alphanumerical characters
	if (newuser.username.includes(' ') ||
		newuser.username.length < 3 ||
		newuser.username.length > 20 ||
		!newuser.username.match(/^[0-9a-z]+[-]?[0-9a-z]+$/)
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
		if (err.parent && err.parent.errno && err.parent.errno === 1062)
			res.status(409).send('Username already exists.');
		else
			util.error(req, res, err);
	}
};

module.exports.update = async (req, res) => {
	if (!req.header('Authorization')) {
		res.status(401).send();
		return;
	}

	const userdata = req.body.user;

	// cannot update username, password or usertype
	if (!userdata || userdata.username || userdata.password || userdata.usertype) {
		res.status(422).send();
		return;
	}

	const { user, data } = await auth.getUserFromToken(req, res);

	// error
	if (data === null)
		return;

	// check that database records exist
	if (!user || !data) {
		res.status(401).send();
		return;
	}

	// do not allow edits from other users except admins
	if (data.usertype > 1 && data.id !== Number(req.params.id)) {
		res.status(403).send();
		return;
	}

	try {
		const response = await User.update(userdata,
			{ where: { id: req.params.id } }
		);
		if (response[0] >= 1)
			util.print('User updated: ' + response[0]);
		res.json({ updated: response[0] });
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.delete = async (req, res) => {
	const user = { deleted: 1 };

	try {
		const response = await User.update(user, {
			where: { id: req.params.id }
		});

		if (response[0] === 1) {
			util.print('User deleted: ' + response[0]);
			res.json({ deleted: response[0] });
		} else {
			res.status(422).send();
		}
	} catch (err) {
		util.error(req, res, err);
	}
};
