const util = require('../util/util.js');
const { BlogCategory } = require('../models');

module.exports.findAll = async (req, res) => {
	try {
		const blogcategories = await BlogCategory.findAll({
			attributes: ['id', 'name'],
			order: [
				['name', 'ASC']
			],
			raw: true
		});

		res.json(blogcategories);
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.fineOne = async (req, res) => {
	try {
		const blogcategory = await BlogCategory.findByPk(req.params.id, {
			raw: true
		});

		if (!blogcategory)
			res.json({ });
		else
			res.json(blogcategory);
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
		const category = await BlogCategory.create(req.body, {
			raw: true
		});

		res.json(category);
	} catch (err) {
		return util.error(req, res, err);
	}
};

module.exports.update = async (req, res) => {
	if (!req.body.name) {
		res.status(422).send('Cannot update from empty data');
		return;
	}

	try {
		const response = await BlogCategory.update(req.body, {
			where: { id: req.params.id }
		});
		if (response[0] === 0)
			return;

		const category = await BlogCategory.findByPk(req.params.id, {
			raw: true
		});
		res.json(category);
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.delete = async (req, res) => {
	try {
		const response = await BlogCategory.destroy({
			where: { id: req.params.id }
		});
		if (response >= 1)
			util.print('Blog categories deleted: ' + response);

		res.json({ deleted: response });
	} catch (err) {
		if (err.parent && err.parent.errno && err.parent.errno === 1451)
			res.status(409).send('The category is used in blogposts.');
		else
			util.error(req, res, err);
	}
};
