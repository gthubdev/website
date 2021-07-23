module.exports = (sequelize, DataTypes) => {
	const SeriesType = sequelize.define('SeriesType', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
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
		tableName: 'SeriesType',
		timestamps: true,
		indexes: [
			{ fields: ['series_id', 'class_id'], unique: true }
		]
	});

	SeriesType.associate = models => {
		models.SeriesType.belongsTo(models.Series, {
			foreignKey: 'series_id'
		});
		models.SeriesType.belongsTo(models.VehicleClass, {
			foreignKey: 'class_id',
			onDelete: 'RESTRICT'
		});
	};

	return SeriesType;
};
