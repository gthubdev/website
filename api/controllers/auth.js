const db = require('../models/');
const util = require('../util/util.js');
const bCrypt = require('bcryptjs');
const env = require('dotenv');
const jwt = require('jsonwebtoken');

module.exports.login = async (req, res) => {
	try {
		const user = await db.User.findOne({
			where: { username: req.body.username },
			include: [
				{ model: db.Usertype }
			]
		});
		if (!user) {
			util.print('User ' + req.body.username + ' does not exist');
			res.status(403).send();
			return;
		}

		const passwordMatch = bCrypt.compareSync(req.body.password, user.password);

		if (!passwordMatch) {
			util.print('User ' + req.body.username + ', password did not match');
			res.status(403).send();
			return;
		}

		const data = generatePayload(user);
		const token = await generateToken(user);

		util.print('User ' + req.body.username + ', password matched');
		res.json({data, token});
	} catch(err) {
		util.error(req, res, err);
	}
};

module.exports.logout = (req, res) => {
	res.status(200).send();
};

module.exports.changepassword = async (req, res) => {
	try {
		const user = await db.User.findOne({
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
							password: bCrypt.hashSync(req.body.newpassword, bCrypt.genSaltSync(8), null)
						});
						util.print('Password for user \'' + result.get('username') + '\' successfully changed.');
						res.status(200).send();
					} catch(error) {
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
	} catch(err) {
		util.error(req, res, err);
	}
};

module.exports.me = async (req, res) => {
	res.json({});
};

function generatePayload(user) {
	const payload = {
		id: user.id,
		username: user.username,
		name: user.name,
		usertype: user.usertype
	};

	return payload;
}

async function generateToken(user) {
	// loads .env variables
	env.config();

	const info = {
		id: user.id,
		usertype: user.usertype
	};

	const gentoken = jwt.sign(info, process.env.JWT_KEY);

	try {
		await db.Auth.create({
			user: user.id,
			token: gentoken
		});

		return gentoken;
	} catch(err) {
		console.log('error happened.');
		throw new Error(err);
	}

}
