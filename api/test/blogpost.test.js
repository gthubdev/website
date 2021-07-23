const supertest = require('supertest');
const each = require('async/each');
const should = require('chai').should();
const server = require('../index');
const { BlogCategory, BlogCatRel, BlogPost, BlogTag, BlogTagRel, User } = require('../models/');

describe('Blogposts', () => {
	let userID, token, cat1ID, cat2ID, tag1ID, tag2ID;
	// Create user testuser/admin
	before(async () => {
		const newuser = {
			username: 'bloguser',
			password: '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.',
			name: 'Test Blogger',
			email: '',
			usertype: 1
		};
		const newcat1 = { name: 'testcat1' };
		const newcat2 = { name: 'testcat2' };
		const newtag1 = { name: 'testtag1' };
		const newtag2 = { name: 'testtag2' };
		try {
			const user = await User.create(newuser);
			const cat1 = await BlogCategory.create(newcat1);
			const cat2 = await BlogCategory.create(newcat2);
			const tag1 = await BlogTag.create(newtag1);
			const tag2 = await BlogTag.create(newtag2);
			userID = user.id;
			cat1ID = cat1.id;
			cat2ID = cat2.id;
			tag1ID = tag1.id;
			tag2ID = tag2.id;
			const res = await supertest(server)
				.post('/api/auth/login')
				.set('Authorization', 'Bearer ' + token)
				.send({ username: 'bloguser', password: 'admin' });

			token = res.body.token;
		} catch (err) {
			should.not.exist(err);
		}
	});

	after(async () => {
		await User.destroy({
			where: { }
		});
		await BlogCategory.destroy({
			where: {}
		});
	});

	beforeEach(done => {
		const blogposts = [
			{ title: 'Title 1', content: '<div>test content</div>', image: '', author: userID },
			{ title: 'Title 2', content: '<div>test content</div>', image: '', author: userID },
			{ title: 'Title 3', content: '<div>test content</div>', image: '', author: userID },
			{ title: 'Title 4', content: '<div>test content</div>', image: '', author: userID },
			{ title: 'Title 5', content: '<div>test content</div>', image: '', author: userID }
		];
		each(blogposts, async blogpost => {
			try {
				await supertest(server)
					.post('/api/blogs')
					.set('Authorization', 'Bearer ' + token)
					.send(blogpost)
					.expect(200);
			} catch (err) {
				should.not.exist(err);
			}
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	afterEach(async () => {
		try {
			await BlogCatRel.destroy({
				where: { }
			});
			await BlogPost.destroy({
				where: { }
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a blogpost', async () => {
		try {
			const blogposts = await BlogPost.findAll({
				limit: 5,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});
			blogposts.forEach(post => {
				post.title.should.have.string('Title');
				post.content.should.equal('<div>test content</div>');
				post.image.should.equal('');
				post.author.should.equal(userID);
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a blogpost with a category', async () => {
		const tmppost = { title: 'Title 7', content: '<div>test content</div>', image: '', author: userID };

		try {
			const cat = await BlogCategory.findOne({
				where: { id: cat1ID }
			});
			tmppost.categories = [];
			tmppost.categories.push(cat);

			const res = await supertest(server)
				.post('/api/blogs')
				.set('Authorization', 'Bearer ' + token)
				.send(tmppost)
				.expect(200);

			res.body.categories[0].category.id.should.equal(cat1ID);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a blogpost with multiple categories', async () => {
		const tmppost = { title: 'Title 8', content: '<div>test content</div>', image: '', author: userID };

		try {
			const ids = [];
			ids.push(cat1ID);
			ids.push(cat2ID);
			tmppost.categories = await BlogCategory.findAll({
				where: { id: ids }
			});

			const res = await supertest(server)
				.post('/api/blogs')
				.set('Authorization', 'Bearer ' + token)
				.send(tmppost)
				.expect(200);

			res.body.categories[0].category.id.should.equal(cat1ID);
			res.body.categories[1].category.id.should.equal(cat2ID);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a blogpost with a tag', async () => {
		const tmppost = { title: 'Title 7', content: '<div>test content</div>', image: '', author: userID };

		try {
			const tag = await BlogTag.findByPk(tag1ID);

			tmppost.tags = [];
			tmppost.tags.push(tag);

			const res = await supertest(server)
				.post('/api/blogs')
				.set('Authorization', 'Bearer ' + token)
				.send(tmppost)
				.expect(200);

			res.body.tags[0].tag.id.should.equal(tag1ID);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a blogpost with multiple tags', async () => {
		const tmppost = { title: 'Title 8', content: '<div>test content</div>', image: '', author: userID };

		try {
			const ids = [];
			ids.push(tag1ID);
			ids.push(tag2ID);

			tmppost.tags = await BlogTag.findAll({
				where: { id: ids }
			});

			const res = await supertest(server)
				.post('/api/blogs')
				.set('Authorization', 'Bearer ' + token)
				.send(tmppost)
				.expect(200);

			res.body.tags[0].tag.id.should.equal(tag1ID);
			res.body.tags[1].tag.id.should.equal(tag2ID);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a blogpost with a category and a tag', async () => {
		const tmppost = { title: 'Title 7', content: '<div>test content</div>', image: '', author: userID };

		try {
			const cat = await BlogCategory.findByPk(cat1ID);
			tmppost.categories = [];
			tmppost.categories.push(cat);

			const tag = await BlogTag.findByPk(tag1ID);
			tmppost.tags = [];
			tmppost.tags.push(tag);

			const res = await supertest(server)
				.post('/api/blogs')
				.set('Authorization', 'Bearer ' + token)
				.send(tmppost)
				.expect(200);

			res.body.categories[0].category.id.should.equal(cat1ID);
			res.body.tags[0].tag.id.should.equal(tag1ID);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a blogpost with multiple categories and tags', async () => {
		const tmppost = { title: 'Title 8', content: '<div>test content</div>', image: '', author: userID };

		try {
			let ids = [];
			ids.push(cat1ID);
			ids.push(cat2ID);
			tmppost.categories = await BlogCategory.findAll({
				where: { id: ids }
			});

			ids = [];
			ids.push(tag1ID);
			ids.push(tag2ID);
			tmppost.tags = await BlogTag.findAll({
				where: { id: ids }
			});

			const res = await supertest(server)
				.post('/api/blogs')
				.set('Authorization', 'Bearer ' + token)
				.send(tmppost)
				.expect(200);

			res.body.categories[0].category.id.should.equal(cat1ID);
			res.body.categories[1].category.id.should.equal(cat2ID);
			res.body.tags[0].tag.id.should.equal(tag1ID);
			res.body.tags[1].tag.id.should.equal(tag2ID);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a blogpost without authorisation', async () => {
		const tmp = { title: 'Title 6', content: '<div>test content</div>', image: '', author: userID };

		try {
			await supertest(server)
				.post('/api/blogs')
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a blogpost', async () => {
		try {
			const blogposts = await BlogPost.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				title: 'NEW_Title',
				content: '<p>new</p>'
			};

			await supertest(server)
				.put('/api/blogs/' + blogposts[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			const post = await BlogPost.findOne({
				where: { id: blogposts[0].id }
			});
			post.title.should.equal('NEW_Title');
			post.content.should.equal('<p>new</p>');
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a blogpost with a category', async () => {
		try {
			const blogposts = await BlogPost.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				title: 'NEW_Title',
				content: '<p>new</p>'
			};
			const cat = await BlogCategory.findByPk(cat2ID);
			tmp.categories = [];
			tmp.categories.push(cat);

			const res = await supertest(server)
				.put('/api/blogs/' + blogposts[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			res.body.categories[0].category.id.should.equal(cat2ID);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a blogpost with multiple categories', async () => {
		try {
			const blogposts = await BlogPost.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				title: 'NEW_Title',
				content: '<p>new</p>'
			};
			const ids = [];
			ids.push(cat1ID);
			ids.push(cat2ID);
			tmp.categories = await BlogCategory.findAll({
				where: { id: ids }
			});

			const res = await supertest(server)
				.put('/api/blogs/' + blogposts[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			res.body.categories[0].category.id.should.equal(cat1ID);
			res.body.categories[1].category.id.should.equal(cat2ID);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a blogpost with a tag', async () => {
		try {
			const blogposts = await BlogPost.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				title: 'NEW_Title',
				content: '<p>new</p>'
			};
			const tag = await BlogTag.findByPk(tag2ID);
			tmp.tags = [];
			tmp.tags.push(tag);

			const res = await supertest(server)
				.put('/api/blogs/' + blogposts[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			res.body.tags[0].tag.id.should.equal(tag2ID);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a blogpost with multiple tags', async () => {
		try {
			const blogposts = await BlogPost.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				title: 'NEW_Title',
				content: '<p>new</p>'
			};
			const ids = [];
			ids.push(tag1ID);
			ids.push(tag2ID);
			tmp.tags = await BlogTag.findAll({
				where: { id: ids }
			});

			const res = await supertest(server)
				.put('/api/blogs/' + blogposts[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			res.body.tags[0].tag.id.should.equal(tag1ID);
			res.body.tags[1].tag.id.should.equal(tag2ID);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a blogpost with a category and a tag', async () => {
		try {
			const blogposts = await BlogPost.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				title: 'NEW_Title',
				content: '<p>new</p>'
			};
			const cat = await BlogCategory.findByPk(cat2ID);
			tmp.categories = [];
			tmp.categories.push(cat);
			const tag = await BlogTag.findByPk(tag2ID);
			tmp.tags = [];
			tmp.tags.push(tag);

			const res = await supertest(server)
				.put('/api/blogs/' + blogposts[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			res.body.categories[0].category.id.should.equal(cat2ID);
			res.body.tags[0].tag.id.should.equal(tag2ID);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a blogpost with multiple categories and tags', async () => {
		try {
			const blogposts = await BlogPost.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				title: 'NEW_Title',
				content: '<p>new</p>'
			};
			let ids = [];
			ids.push(cat1ID);
			ids.push(cat2ID);
			tmp.categories = await BlogCategory.findAll({
				where: { id: ids }
			});
			ids = [];
			ids.push(tag1ID);
			ids.push(tag2ID);
			tmp.tags = await BlogTag.findAll({
				where: { id: ids }
			});

			const res = await supertest(server)
				.put('/api/blogs/' + blogposts[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			res.body.categories[0].category.id.should.equal(cat1ID);
			res.body.categories[1].category.id.should.equal(cat2ID);
			res.body.tags[0].tag.id.should.equal(tag1ID);
			res.body.tags[1].tag.id.should.equal(tag2ID);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a blogpost without authorisation', async () => {
		try {
			const blogposts = await BlogPost.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				title: 'Title',
				content: '<p>new</p>'
			};

			await supertest(server)
				.put('/api/blogs/' + blogposts[0].id)
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a blogpost', async () => {
		let nrOfPostsBefore, postID;
		const tmp = { title: 'Title 6', content: '<div>test content</div>', image: '', author: userID };

		try {
			const post = await BlogPost.create(tmp);
			postID = post.id;
			const posts = await BlogPost.findAll();
			nrOfPostsBefore = posts.length;
			await supertest(server)
				.delete('/api/blogs/' + postID)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);
			const response = await BlogPost.findAll();
			response.length.should.equal(nrOfPostsBefore - 1);
			response.forEach(p => {
				p.id.should.not.equal(postID);
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a blogpost with categories', async () => {
		let nrOfPostsBefore, postID;
		const tmp = { title: 'Title 6', content: '<div>test content</div>', image: '', author: userID };

		try {
			const ids = [];
			ids.push(cat1ID);
			ids.push(cat2ID);
			const categories = await BlogCategory.findAll({
				where: { id: ids }
			});
			tmp.categories = categories.map(c => c.get({ plain: true }));

			const res = await supertest(server)
				.post('/api/blogs')
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			postID = res.body.id;

			const rels = await BlogCatRel.findAll({
				where: { post_id: postID }
			});
			rels.length.should.equal(2);

			const posts = await BlogPost.findAll();
			nrOfPostsBefore = posts.length;
			await supertest(server)
				.delete('/api/blogs/' + postID)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			const response = await BlogPost.findAll();
			response.length.should.equal(nrOfPostsBefore - 1);
			response.forEach(p => {
				p.id.should.not.equal(postID);
			});

			const cats = await BlogCatRel.findAll({
				where: { post_id: postID }
			});
			cats.length.should.equal(0);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a blogpost with tags', async () => {
		let nrOfPostsBefore, postID;
		const tmp = { title: 'Title 6', content: '<div>test content</div>', image: '', author: userID };

		try {
			const ids = [];
			ids.push(tag1ID);
			ids.push(tag2ID);
			const tags = await BlogTag.findAll({
				where: { id: ids }
			});
			tmp.tags = tags.map(t => t.get({ plain: true }));

			const res = await supertest(server)
				.post('/api/blogs')
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			postID = res.body.id;

			const rels = await BlogTagRel.findAll({
				where: { post_id: postID }
			});
			rels.length.should.equal(2);

			const posts = await BlogPost.findAll();
			nrOfPostsBefore = posts.length;
			await supertest(server)
				.delete('/api/blogs/' + postID)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			const response = await BlogPost.findAll();
			response.length.should.equal(nrOfPostsBefore - 1);
			response.forEach(p => {
				p.id.should.not.equal(postID);
			});

			const tag_rels = await BlogTagRel.findAll({
				where: { post_id: postID }
			});
			tag_rels.length.should.equal(0);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a blogpost without authorisation', async () => {
		const tmp = { title: 'Title 6', content: '<div>test content</div>', image: '', author: userID };

		try {
			const post = await BlogPost.create(tmp);
			await supertest(server)
				.delete('/api/blogs/' + post.id)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});
});
