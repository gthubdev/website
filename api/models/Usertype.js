module.exports = (sequelize, DataTypes) => {
	const Usertype = sequelize.define('Usertype', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: DataTypes.STRING,
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('NOW')
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('NOW')
		}
	}, {
		tableName: 'Usertype',
		timestamps: true
	});

	Usertype.associate = models => {
		models.Usertype.hasMany(models.User, { foreignKey: 'usertype' });
	};

	return Usertype;
};
