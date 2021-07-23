const { BlogCatRel, BlogPost, BlogTagRel } = require('../models');
const util = require('../util/util');
const include_options = require('../util/include_options');

module.exports.create = async (req, res) => {
	try {
		const newblogpost = await BlogPost.create(req.body);

		if (req.body.categories) {
			const categories = [];
			req.body.categories.forEach(c => {
				categories.push({
					post_id: newblogpost.id,
					category_id: c.id
				});
			});
			await BlogCatRel.bulkCreate(categories);
		}

		if (req.body.tags) {
			const tags = [];
			req.body.tags.forEach(t => {
				tags.push({
					post_id: newblogpost.id,
					tag_id: t.id
				});
			});
			await BlogTagRel.bulkCreate(tags);
		}

		const blogpost = await BlogPost.findByPk(newblogpost.id, {
			include: include_options.blogpost
		});

		util.print('Blogpost created');
		res.json(blogpost.get({ plain: true }));
	} catch (err) {
		util.error(req, res, err);
	}
};

module.exports.update = async (req, res) => {
	try {
		const [updated, deleted_cat, deleted_tag] = await Promise.all([
			BlogPost.update(req.body,
				{ where: { id: req.params.id } }
			),
			BlogCatRel.destroy({
				where: { post_id: req.params.id }
			}),
			BlogTagRel.destroy({
				where: { post_id: req.params.id }
			})
		]);

		if (updated !== 1 && deleted_cat < 0 && deleted_tag < 0) {
			util.error(req, res, 'Error updating blogpost ' + req.body.title);
			return;
		}

		if (req.body.categories) {
			const categories = [];
			req.body.categories.forEach(c => {
				categories.push({
					post_id: req.params.id,
					category_id: c.id
				});
			});
			await BlogCatRel.bulkCreate(categories);
		}

		if (req.body.tags) {
			const tags = [];
			req.body.tags.forEach(t => {
				tags.push({
					post_id: req.params.id,
					tag_id: t.id
				});
			});
			await BlogTagRel.bulkCreate(tags);
		}

		const blogpost = await BlogPost.findByPk(req.params.id, {
			include: include_options.blogpost
		});
		util.print(updated + ' BlogPost updated');
		res.json(blogpost.get({ plain: true }));
	} catch (err) {
		console.log(err);
		util.error(req, res, err);
	}
};

module.exports.delete = async (req, res) => {
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

module.exports.findAll = async (req, res) => {
	try {
		const blogposts = await BlogPost.findAll({
			include: include_options.blogpost
		});

		const data = {
			blogposts: blogposts.map(p => p.get({ plain: true }))
		};

		res.json(data);
	} catch (err) {
		util.error(req, res, err);
	}
};
