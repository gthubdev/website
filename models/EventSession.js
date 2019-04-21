module.exports = (sequelize, DataTypes) => {
	let EventSession = sequelize.define('EventSession', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: DataTypes.STRING,
		starttime: DataTypes.DATE,
		endtime: DataTypes.DATE,
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('NOW')
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('NOW')
		}
	}, {
		tableName: 'EventSession',
		timestamps: true
	});

	EventSession.associate = models => {
		models.EventSession.belongsTo(models.Event, {foreignKey: 'event'});
		models.EventSession.belongsTo(models.Series, {foreignKey: 'series'});
	};

	return EventSession;
};
