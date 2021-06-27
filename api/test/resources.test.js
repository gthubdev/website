const supertest = require('supertest');
const should = require('chai').should();
const server = require('../index');
const { User } = require('../models/');

describe('Resources', () => {
	let userID, token;
	// Create user testuser/admin
	before(async () => {
		const newuser = {
			username: 'resourceuser',
			password: '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.',
			name: 'Resource Test User',
			email: '',
			usertype: 1
		};
		try {
			const user = await User.create(newuser);
			userID = user.id;
			const res = await supertest(server)
				.post('/api/auth/login')
				.set('Authorization', 'Bearer ' + token)
				.send({ username: 'resourceuser', password: 'admin' });

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

	it('Fetching resources', async () => {
		try {
			const res = await supertest(server)
				.get('/api/resources')
				.set('Authorization', 'Bearer ' + token)
				.send()
				.expect(200);

			// console.log(res.body);
			res.body.blogposts.should.have.lengthOf.at.least(0);
			res.body.events.should.have.lengthOf.at.least(0);
			res.body.series.should.have.lengthOf.at.least(0);
			res.body.tracks.should.have.lengthOf.at.least(0);
			res.body.vehicleclasscategories.should.have.lengthOf.at.least(0);
			res.body.vehicleclasses.should.have.lengthOf.at.least(0);
			res.body.sessiontypes.should.have.lengthOf.at.least(0);
			res.body.timezones.should.have.lengthOf.at.least(0);
		} catch (err) {
			should.not.exist(err);
		}
	});

	it('Fetching resources without authorisation', async () => {
		try {
			await supertest(server)
				.get('/api/resources')
				.send()
				.expect(401);
		} catch (err) {
			should.not.exist(err);
		}
	});
});
