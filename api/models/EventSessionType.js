module.exports = (sequelize, DataTypes) => {
	const EventSessionType = sequelize.define('EventSessionType', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING
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
		tableName: 'EventSessionType',
		timestamps: true
	});

	EventSessionType.associate = models => {
		models.EventSessionType.hasMany(models.EventSession, {
			foreignKey: 'sessiontype',
			allowNull: false
		});
	};

	return EventSessionType;
};
