module.exports = (sequelize, DataTypes) => {
	let Series = sequelize.define('Series', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: DataTypes.STRING,
		logo: DataTypes.STRING,
		homepage: DataTypes.STRING,
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('NOW')
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('NOW')
		}
	}, {
		tableName: 'Series',
		timestamps: true
	});

	Series.associate = models => {
		models.Series.hasMany(models.EventSession, {foreignKey: 'series'});
	};

	return Series;
};
