const supertest = require('supertest');
const each = require('async/each');
const should = require('chai').should();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const server = require('../index');
const { BlogPost, User } = require('../models/');

describe('Blog', () => {
	let userID, token;
	// Create user testuser/admin
	before(async () => {
		const newuser = {
			username: 'bloguser',
			password: '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.',
			name: 'Test Blogger',
			email: '',
			usertype: 1
		};
		try {
			const user = await User.create(newuser);
			userID = user.id;
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
		const response = await User.destroy({
			where: { id: userID }
		});
		response.should.equal(1);
	});

	beforeEach(done => {
		const blogposts = [
			{ title: 'Ttile 1', content: '<div>test content</div>', image: '', author: userID },
			{ title: 'Ttile 2', content: '<div>test content</div>', image: '', author: userID },
			{ title: 'Ttile 3', content: '<div>test content</div>', image: '', author: userID },
			{ title: 'Ttile 4', content: '<div>test content</div>', image: '', author: userID },
			{ title: 'Ttile 5', content: '<div>test content</div>', image: '', author: userID }
		];
		each(blogposts, async blogpost => {
			// Need this, because the controller is parsing req.body.track
			const tmp = {
				blogpost
			};
			try {
				await supertest(server)
					.post('/api/blog')
					.set('Authorization', 'Bearer ' + token)
					.send(tmp)
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
			const blogposts = await BlogPost.findAll({
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const ids = [];
			blogposts.forEach(t => ids.push(t.id));

			await BlogPost.destroy({
				where: {
					id: {
						[Op.in]: ids
					}
				}
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
				post.title.should.have.string('Ttile');
				post.content.should.equal('<div>test content</div>');
				post.image.should.equal('');
				post.author.should.equal(userID);
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a blogpost without authorisation', async () => {
		const tmp = { title: 'Ttile 6', content: '<div>test content</div>', image: '', author: userID };

		try {
			await supertest(server)
				.post('/api/blog')
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
				blogpost: {
					title: 'NEW_Ttile',
					content: '<p>new</p>'
				}
			};

			await supertest(server)
				.put('/api/blog/' + blogposts[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			const post = await BlogPost.findOne({
				where: { id: blogposts[0].id }
			});
			post.title.should.equal('NEW_Ttile');
			post.content.should.equal('<p>new</p>');
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
				blogpost: {
					title: 'TITLE',
					content: '<p>new</p>'
				}
			};

			await supertest(server)
				.put('/api/blog/' + blogposts[0].id)
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a blogpost', async () => {
		let nrOfPostsBefore, postID;
		const tmp = { title: 'Ttile 6', content: '<div>test content</div>', image: '', author: userID };

		try {
			const post = await BlogPost.create(tmp);
			postID = post.id;
			const posts = await BlogPost.findAll();
			nrOfPostsBefore = posts.length;
			await supertest(server)
				.delete('/api/blog/' + postID)
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

	it('Deleting a blogpost without authorisation', async () => {
		const tmp = { title: 'Ttile 6', content: '<div>test content</div>', image: '', author: userID };

		try {
			const post = await BlogPost.create(tmp);
			await supertest(server)
				.delete('/api/blog/' + post.id)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});
});
