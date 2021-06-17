const { BlogPost, User } = require('../models');
const util = require('../util/util');

module.exports.createBlogPost = async (req, res) => {
	try {
		const blogpost = await BlogPost.create(req.body.blogpost);
		util.print('BlogPost created');
		res.json(blogpost.get({ plain: true }));
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.updateBlogPost = async (req, res) => {
	try {
		const response = await BlogPost.update(req.body.blogpost,
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
