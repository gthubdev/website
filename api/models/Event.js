module.exports = (sequelize, DataTypes) => {
	const Event = sequelize.define('Event', {
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
			foreignKey: 'track_id',
			onDelete: 'RESTRICT'
		});
		models.Event.belongsTo(models.Series, {
			foreignKey: 'mainseries_id',
			onDelete: 'RESTRICT'
		});
		models.Event.hasMany(models.EventSession, {
			foreignKey: 'event_id',
			onDelete: 'CASCADE'
		});
		models.Event.hasMany(models.SupportSeries, {
			foreignKey: 'event_id'
		});
	};

	return Event;
};
