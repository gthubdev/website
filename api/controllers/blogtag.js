const util = require('../util/util.js');
const { BlogTag } = require('../models');

module.exports.findAll = async (req, res) => {
	try {
		const blogtags = await BlogTag.findAll({
			attributes: ['id', 'name'],
			order: [
				['name', 'ASC']
			],
			raw: true
		});

		res.json(blogtags);
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.fineOne = async (req, res) => {
	try {
		const blogtag = await BlogTag.findByPk(req.params.id, {
			raw: true
		});

		if (!blogtag)
			res.json({ });
		else
			res.json(blogtag);
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.create = async (req, res) => {
	if (!req.body.name) {
		res.status(422).send('Cannot create from empty data');
		return;
	}

	try {
		const tag = await BlogTag.create(req.body, {
			raw: true
		});

		res.json(tag);
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.update = async (req, res) => {
	if (!req.body.name) {
		res.status(422).send('Cannot update from empty data');
		return;
	}

	try {
		const response = await BlogTag.update(req.body, {
			where: { id: req.params.id }
		});
		if (response[0] === 0)
			return;

		const tag = await BlogTag.findByPk(req.params.id, {
			raw: true
		});
		res.json(tag);
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.delete = async (req, res) => {
	try {
		const response = await BlogTag.destroy({
			where: { id: req.params.id }
		});
		if (response >= 1)
			util.print('Blog tags deleted: ' + response);

		res.json({ deleted: response });
	} catch (err) {
		if (err.parent && err.parent.errno && err.parent.errno === 1451)
			res.status(409).send('The tag is used in blogposts.');
		else
			util.error(req, res, err);
	}
};
