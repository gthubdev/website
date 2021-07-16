module.exports = (sequelize, DataTypes) => {
	const EventSession = sequelize.define('EventSession', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: DataTypes.STRING,
		starttime: DataTypes.DATE,
		duration: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
			validate: {
				min: 0
			}
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
		tableName: 'EventSession',
		timestamps: true
	});

	EventSession.associate = models => {
		models.EventSession.belongsTo(models.Event, {
			foreignKey: 'event',
			onDelete: 'CASCADE'
		});
		models.EventSession.belongsTo(models.Series, {
			foreignKey: 'series',
			onDelete: 'RESTRICT'
		});
		models.EventSession.belongsTo(models.EventSessionType, {
			foreignKey: 'sessiontype',
			as: 'type',
			allowNull: false
		});
	};

	return EventSession;
};
