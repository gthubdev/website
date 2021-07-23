module.exports = (sequelize, DataTypes) => {
	const SupportSeries = sequelize.define('SupportSeries', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		event_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		series_id: {
			type: DataTypes.INTEGER,
			allowNull: false
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
		tableName: 'SupportSeries',
		timestamps: true,
		indexes: [
			{ fields: ['event_id', 'series_id'], unique: true }
		]
	});

	SupportSeries.associate = models => {
		models.SupportSeries.belongsTo(models.Event, {
			foreignKey: 'event_id',
			onDelete: 'RESTRICT'
		});
		models.SupportSeries.belongsTo(models.Series, {
			foreignKey: 'series_id',
			onDelete: 'RESTRICT'
		});
	};

	return SupportSeries;
};
