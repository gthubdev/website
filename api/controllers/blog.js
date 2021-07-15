const { BlogCategory, BlogCatRel, BlogPost, User } = require('../models');
const util = require('../util/util');

module.exports.createBlogPost = async (req, res) => {
	try {
		const newblogpost = await BlogPost.create(req.body);

		const categories = [];
		if (req.body.categories) {
			req.body.categories.forEach(c => {
				categories.push({
					post: newblogpost.id,
					category: c.id
				});
			});
			await BlogCatRel.bulkCreate(categories);
		}

		const blogpost = await BlogPost.findOne({
			where: { id: newblogpost.id },
			include: [
				{
					model: User,
					attributes: ['name', 'image']
				},
				{
					model: BlogCatRel,
					attributes: ['id'],
					include: [
						{
							model: BlogCategory,
							attributes: ['id', 'name']
						}
					]
				}
			]
		});

		util.print('Blogpost created');
		res.json(blogpost.get({ plain: true }));
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.updateBlogPost = async (req, res) => {
	try {
		const response = await BlogPost.update(req.body,
			{ where: { id: req.params.id } }
		);
		if (response[0] === 0)
			return;

		util.print(response[0] + ' BlogPost updated');

		const blogpost = await BlogPost.findOne({
			where: { id: req.params.id },
			include: [
				{ model: User }
			]
		});
		res.json(blogpost.get({ plain: true }));
	} catch (err) {
		console.log(err);
		util.error(req, res, err);
	}
};

module.exports.deleteBlogPost = async (req, res) => {
	try {
		const response = await BlogPost.destroy({
			where: { id: req.params.id }
		});
		if (response >= 1)
			util.print('BlogPosts deleted: ' + response);
		res.json({ deleted: response });
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.getBlog = async (req, res) => {
	try {
		const blogposts = await BlogPost.findAll({
			include: [
				{
					model: User,
					attributes: ['name']
				}
			],
			order: [
				['createdAt', 'DESC']
			]
		});

		const data = {
			blogposts
		};

		res.json(data);
	} catch (err) {
		util.error(req, res, err);
	}
};
