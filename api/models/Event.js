module.exports = (sequelize, DataTypes) => {
	let Event = sequelize.define('Event', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: DataTypes.STRING,
		priority: DataTypes.INTEGER,
		logo: {
			type: DataTypes.STRING,
			defaultValue: ''
		},
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
		models.Event.belongsTo(models.Track, {
			foreignKey: 'track',
			onDelete: 'RESTRICT'
		});
		models.Event.belongsTo(models.Series, {foreignKey: 'mainseries'});
		models.Event.hasMany(models.EventSession, {
			foreignKey: 'event',
			onDelete: 'CASCADE'
		});
		models.Event.hasMany(models.SupportSeries, {foreignKey: 'event'});
	};

	return Event;
};
