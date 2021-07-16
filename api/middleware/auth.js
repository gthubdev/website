const env = require('dotenv');
const jwt = require('jsonwebtoken');
const { Auth, User } = require('../models');
// const util = require('../util/util');

module.exports.staff_auth = async (req, res, next) => {
	if (!req.header('Authorization')) {
		res.status(401).send();
		return;
	}

	const { user, data } = await getUserFromToken(req, res);

	// check that database records exist
	if (!user || !data) {
		res.status(401).send();
		return;
	}

	// check that JWT belongs to the actual user
	if (user.user !== data.id) {
		res.status(403).send();
		return;
	}

	// check for correct usertype
	if (data.usertype !== 1 && data.usertype !== 2) {
		res.status(403).send();
		return;
	}

	next();
};

module.exports.admin_auth = async (req, res, next) => {
	if (!req.header('Authorization')) {
		res.status(401).send();
		return;
	}

	const { user, data } = await getUserFromToken(req, res);

	// check that database records exist
	if (!user || !data) {
		res.status(401).send();
		return;
	}

	// check that JWT belongs to the actual user
	if (user.user !== data.id) {
		res.status(403).send();
		return;
	}

	// check for correct usertype
	if (data.usertype !== 1) {
		res.status(403).send();
		return;
	}

	next();
};

async function getUserFromToken(req, res) {
	// load .env variables
	env.config();

	try {
		const token = req.header('Authorization').replace('Bearer ', '');
		const data = jwt.verify(token, process.env.JWT_KEY);

		const user = await Auth.findOne({
			where: { token: token },
			include: [
				{
					model: User,
					attributes: ['id', 'username']
				}
			]
		});

		return {
			user,
			data
		};
	} catch (err) {
		// util.error(req, res, err);
		return {
			user: null,
			data: null
		};
	}
}
module.exports.getUserFromToken = getUserFromToken;
