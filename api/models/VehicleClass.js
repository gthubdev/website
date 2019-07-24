module.exports = (sequelize, DataTypes) => {
	let VehicleClass = sequelize.define('VehicleClass', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: DataTypes.STRING,
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('NOW')
		},
		updatedAt: {
			type: DataTypes.DATE,
			defaultValue: sequelize.fn('NOW')
		}
	}, {
		tableName: 'VehicleClass',
		timestamps: true
	});

	VehicleClass.associate = models => {
		models.VehicleClass.belongsTo(models.VehicleClassCategory, {foreignKey: 'category'});
		models.VehicleClass.hasMany(models.SeriesType, {
			foreignKey: 'class',
			onDelete: 'RESTRICT'
		});
	};

	return VehicleClass;
};
