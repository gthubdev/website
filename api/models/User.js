module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define('User', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		username: DataTypes.STRING,
		password: DataTypes.STRING,
		name: DataTypes.STRING,
		email: {
			type: DataTypes.STRING,
			default: ''
		},
		image: {
			type: DataTypes.STRING(1023),
			default: ''
		},
		twitter: {
			type: DataTypes.STRING,
			default: ''
		},
		instagram: {
			type: DataTypes.STRING,
			default: ''
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('NOW')
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('NOW')
		}
	}, {
		tableName: 'User',
		timestamps: true
	});

	User.associate = models => {
		models.User.belongsTo(models.Usertype, { foreignKey: 'usertype' });
		models.User.hasMany(models.Auth, { foreignKey: 'user' });
		models.User.hasMany(models.BlogPost, {
			foreignKey: 'author',
			onDelete: 'RESTRICT'
		});
	};

	return User;
};
