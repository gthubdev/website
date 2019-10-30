module.exports = (sequelize, DataTypes) => {
	let Auth = sequelize.define('Auth', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		token: {
			type: DataTypes.STRING,
			defaultValue: ''
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
		tableName: 'Auth',
		timestamps: true
	});

	Auth.associate = models => {
		models.Auth.belongsTo(models.User, {
			foreignKey: 'user',
			onDelete: 'CASCADE'
		});
	};

	return Auth;
};
