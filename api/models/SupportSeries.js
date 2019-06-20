module.exports = (sequelize, DataTypes) => {
	let SupportSeries = sequelize.define('SupportSeries', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		event: DataTypes.INTEGER,
		series: DataTypes.INTEGER,
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
			{ fields: ['event', 'series'], unique: true }
		]
	});

	SupportSeries.associate = models => {
		models.SupportSeries.belongsTo(models.Event, {foreignKey: 'event'});
		models.SupportSeries.belongsTo(models.Series, {
			foreignKey: 'series',
			onDelete: 'RESTRICT'
		});
	};

	return SupportSeries;
};
