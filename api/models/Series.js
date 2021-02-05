module.exports = (sequelize, DataTypes) => {
	const Series = sequelize.define('Series', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: DataTypes.STRING,
		shortname: DataTypes.STRING,
		logo: {
			type: DataTypes.STRING,
			defaultValue: ''
		},
		thumbnail: {
			type: DataTypes.STRING,
			defaultValue: ''
		},
		homepage: {
			type: DataTypes.STRING,
			defaultValue: ''
		},
		priority: DataTypes.INTEGER,
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('NOW')
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('NOW')
		}
	}, {
		tableName: 'Series',
		timestamps: true
	});

	Series.associate = models => {
		models.Series.hasMany(models.EventSession, {
			foreignKey: 'series',
			onDelete: 'RESTRICT'
		});
		models.Series.hasMany(models.Event, {
			foreignKey: 'mainseries',
			onDelete: 'RESTRICT'
		});
		models.Series.hasMany(models.SupportSeries, {
			foreignKey: 'series',
			onDelete: 'RESTRICT'
		});
		models.Series.hasMany(models.SeriesType, { foreignKey: 'series' });
	};

	return Series;
};
