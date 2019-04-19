module.exports = (sequelize, DataTypes) => {
	let Event = sequelize.define('Event', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: DataTypes.STRING,
		logo: DataTypes.STRING,
		startdate: DataTypes.DATEONLY,
		enddate: DataTypes.DATEONLY,
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('NOW')
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('NOW')
		}
	}, {
		tableName: 'Event',
		timestamps: true
	});

	Event.associate = models => {
		models.Event.belongsTo(models.Track, {foreignKey: 'track'});
		models.Event.hasMany(models.EventSession, {foreignKey: 'event'});
	};

	return Event;
};
