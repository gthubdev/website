module.exports = (sequelize, DataTypes) => {
	let SeriesType = sequelize.define('SeriesType', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		series: DataTypes.INTEGER,
		class: DataTypes.INTEGER,
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
			{ fields: ['series', 'class'], unique: true }
		]
	});

	SeriesType.associate = models => {
		models.SeriesType.belongsTo(models.Series, { foreignKey: 'series' });
		models.SeriesType.belongsTo(models.VehicleClass, {
			foreignKey: 'class',
			onDelete: 'RESTRICT'
		});
	};

	return SeriesType;
};
