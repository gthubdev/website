const supertest = require('supertest');
const each = require('async/each');
const should = require('chai').should();
const server = require('../index');
const { User, BlogTag } = require('../models/');

describe('Blog Tags', () => {
	let token, userID;

	before(async () => {
		const newuser = {
			username: 'testuser',
			password: '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.',
			name: 'Testuser',
			email: '',
			usertype_id: 2
		};
		try {
			const user = await User.create(newuser);
			const res = await supertest(server)
				.post('/api/auth/login')
				.send({ username: 'testuser', password: 'admin' })
				.expect(200);

			token = res.body.token;
			userID = user.id;
		} catch (err) {
			should.not.exist(err);
		}
	});

	after(async () => {
		try {
			await supertest(server)
				.post('/api/auth/logout')
				.set('Authorization', 'Bearer ' + token)
				.send()
				.expect(200);
			await User.destroy({
				where: { }
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	beforeEach(done => {
		const tags = [
			{ name: 'TestTag 1' },
			{ name: 'TestTag 2' },
			{ name: 'TestTag 3' },
			{ name: 'TestTag 4' },
			{ name: 'TestTag 5' }
		];
		each(tags, async tag => {
			try {
				await supertest(server)
					.post('/api/blogtag')
					.send(tag)
					.set('Authorization', 'Bearer ' + token)
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
			await BlogTag.destroy({
				where: { }
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a tag', async () => {
		try {
			const tags = await BlogTag.findAll({
				limit: 5,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			tags.forEach(tag => {
				tag.name.should.have.string('TestTag');
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a tag without data', done => {
		const tags = [
			{ }
		];
		each(tags, async tag => {
			try {
				await supertest(server)
					.post('/api/blogtag')
					.send(tag)
					.set('Authorization', 'Bearer ' + token)
					.expect(422);
			} catch (err) {
				should.not.exist(err);
			}
		}, err => {
			should.not.exist(err);
			done();
		});
	});

	it('Creating a tag without authorisation', async () => {
		const tmp = { name: 'TestTag' };

		try {
			await supertest(server)
				.post('/api/blogtag')
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Creating a tag with invalid authorisation', async () => {
		const tmp = { name: 'TestTag' };

		try {
			await supertest(server)
				.post('/api/blogtag')
				.set('Authorization', 'Bearer ' + token.toLowerCase().toUpperCase())
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a tag', async () => {
		try {
			const tags = await BlogTag.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				name: 'NEWNAME'
			};

			await supertest(server)
				.put('/api/blogtag/' + tags[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(200);

			const tag = await BlogTag.findByPk(tags[0].id);

			tag.name.should.equal('NEWNAME');
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a tag with empty data', async () => {
		try {
			const tags = await BlogTag.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = { };

			await supertest(server)
				.put('/api/blogtag/' + tags[0].id)
				.set('Authorization', 'Bearer ' + token)
				.send(tmp)
				.expect(422);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a tag without authorisation', async () => {
		try {
			const tags = await BlogTag.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				name: 'NEWNAME'
			};

			await supertest(server)
				.put('/api/blogtag/' + tags[0].id)
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Updating a tag with invalid authorisation', async () => {
		try {
			const tags = await BlogTag.findAll({
				limit: 1,
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const tmp = {
				name: 'NEWNAME'
			};

			await supertest(server)
				.put('/api/blogtag/' + tags[0].id)
				.set('Authorization', 'Bearer ' + token.toLowerCase().toUpperCase())
				.send(tmp)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a tag', async () => {
		let nrOfTagsBefore, tagID;
		const tmp = {
			name: 'testtag123'
		};

		try {
			const tag = await BlogTag.create(tmp);
			tagID = tag.id;
			const tags = await BlogTag.findAll();
			nrOfTagsBefore = tags.length;

			await supertest(server)
				.delete('/api/blogtag/' + tagID)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			const response = await BlogTag.findAll();
			response.length.should.equal(nrOfTagsBefore - 1);
			response.forEach(t => {
				t.id.should.not.equal(tagID);
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a tag used by a blog post', async () => {
		let tagID;
		const tmp = {
			name: 'testtag123'
		};
		const tmppost = { title: 'Title 7', content: '<div>test content</div>', image: '', author_id: userID };

		try {
			const tag = await BlogTag.create(tmp);
			tagID = tag.id;
			tmppost.tags = [];
			tmppost.tags.push(tag.get({ plain: true }));

			const post = await supertest(server)
				.post('/api/blogs')
				.set('Authorization', 'Bearer ' + token)
				.send(tmppost)
				.expect(200);

			await supertest(server)
				.delete('/api/blogtag/' + tagID)
				.set('Authorization', 'Bearer ' + token)
				.expect(409);

			await supertest(server)
				.delete('/api/blogs/' + post.body.id)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			await supertest(server)
				.delete('/api/blogtag/' + tagID)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a tag without authorisation', async () => {
		const tmp = {
			name: 'testtag123'
		};

		try {
			const tag = await BlogTag.create(tmp);
			await supertest(server)
				.delete('/api/blogtag/' + tag.id)
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Deleting a tag without authorisation', async () => {
		const tmp = {
			name: 'testtag123'
		};

		try {
			const tag = await BlogTag.create(tmp);
			await supertest(server)
				.delete('/api/blogtag/' + tag.id)
				.set('Authorization', 'Bearer ' + token.toLowerCase().toUpperCase())
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Find one tag', async () => {
		try {
			const tags = await BlogTag.findAll({
				limit: 1
			});

			const findOne = await supertest(server)
				.get('/api/blogtag/' + tags[0].id)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			findOne.body.id.should.equal(tags[0].id);
			findOne.body.name.should.equal(tags[0].name);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Find one tag with invalid id', async () => {
		try {
			const tags = await BlogTag.findAll({
				limit: 1,
				order: [
					['id', 'DESC']
				]
			});

			const findOne = await supertest(server)
				.get('/api/blogtag/' + tags[0].id + 1)
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			Object.keys(findOne.body).length.should.equal(0);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Find all tags', async () => {
		try {
			const tags = await supertest(server)
				.get('/api/blogtag')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			tags.body.length.should.equal(5);
			tags.body.forEach(t => {
				t.name.should.have.string('TestTag');
			});
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Find all tags (empty)', async () => {
		try {
			const tags = await BlogTag.findAll({
				order: [
					['createdAt', 'DESC'],
					['id', 'DESC']
				]
			});

			const ids = [];
			tags.forEach(t => ids.push(t.id));

			await BlogTag.destroy({
				where: { id: ids }
			});

			const res = await supertest(server)
				.get('/api/blogtag/')
				.set('Authorization', 'Bearer ' + token)
				.expect(200);

			res.body.length.should.equal(0);
		} catch (err) {
			should.not.exist(err);
		}
	});
});
