module.exports = (sequelize, DataTypes) => {
	let Track = sequelize.define('Track', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: DataTypes.STRING,
		location: DataTypes.STRING,
		length: DataTypes.DOUBLE,
		map: DataTypes.STRING,
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('NOW')
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('NOW')
		}
	}, {
		tableName: 'Track',
		timestamps: true
	});

	Track.associate = models => {
		models.Track.hasMany(models.Event, {foreignKey: 'track'});
	};

	return Track;
};
