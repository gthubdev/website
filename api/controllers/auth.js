const bCrypt = require('bcryptjs');
const env = require('dotenv');
const jwt = require('jsonwebtoken');
const util = require('../util/util.js');
const { User, Usertype, Auth } = require('../models/');

module.exports.login = async (req, res) => {
	try {
		const user = await User.findOne({
			where: { username: req.body.username },
			include: [
				{ model: Usertype }
			]
		});
		if (!user) {
			util.print('User ' + req.body.username + ' does not exist');
			res.status(401).send();
			return;
		}

		const passwordMatch = bCrypt.compareSync(req.body.password, user.password);

		if (!passwordMatch) {
			util.print('User ' + req.body.username + ', password did not match');
			res.status(401).send();
			return;
		}

		const token = await generateToken(user);

		util.print('User ' + req.body.username + ' logged in successfully.');
		res.json({ token });
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.logout = async (req, res) => {
	if (!req.header('Authorization')) {
		res.status(401).send();
		return;
	}

	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		const data = jwt.verify(token, process.env.JWT_KEY);
		const response = await Auth.destroy({
			where: { token }
		});

		if (response === 1) {
			util.print('User ' + data.username + ' logged out successfully.');
			res.status(200).send();
		} else {
			res.status(401).send();
		}
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.changepassword = async (req, res) => {
	try {
		const user = await User.findOne({
			where: { username: req.body.username }
		});
		if (user) {
			bCrypt.compare(req.body.oldpassword, user.password, async (err, matches) => {
				if (err) {
					util.error(req, res, err);
					return;
				}
				if (matches) {
					try {
						const result = await user.update({
							password: bCrypt.hashSync(req.body.newpassword, bCrypt.genSaltSync(8))
						});
						util.print('Password for user \'' + result.get('username') + '\' successfully changed.');
						res.status(200).send();
					} catch (error) {
						util.error(req, res, err);
					}
				} else {
					// TODO, redirect & print error
					util.print('User ' + req.body.username + ' tried changing passwords, passwords did not match.');
					res.status(401).send('Wrong user/password combination.');
				}
			});
		} else {
			util.print('User ' + req.body.username + ' does not exist');
			res.status(401).send('Wrong user/password combination.');
		}
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.me = async (req, res) => {
	if (!req.header('Authorization')) {
		res.status(401).send();
		return;
	}

	try {
		// load .env variables
		env.config();

		const token = req.header('Authorization').replace('Bearer ', '');
		const data = jwt.verify(token, process.env.JWT_KEY);
		const user = await User.findByPk(data.id, {
			attributes: ['id', 'username', 'name', 'usertype_id']
		});
		res.json(user);
	} catch (err) {
		util.error(req, res, err);
	}
};

async function generateToken(user) {
	// load .env variables
	env.config();

	const info = {
		id: user.id,
		username: user.username,
		usertype: user.usertype
	};

	if (!process.env.JWT_KEY) {
		console.error('No JWT-key in .env found.');
		process.exit(1);
	}

	const gentoken = jwt.sign(info, process.env.JWT_KEY);

	try {
		await Auth.create({
			user_id: user.id,
			token: gentoken
		});

		return gentoken;
	} catch (err) {
		console.error('Could not generate JWT-token.');
		throw new Error(err);
	}
}
