module.exports = (sequelize, DataTypes) => {
	const VehicleClassCategory = sequelize.define('VehicleClassCategory', {
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
		tableName: 'VehicleClassCategory',
		timestamps: true
	});

	VehicleClassCategory.associate = models => {
		models.VehicleClassCategory.hasMany(models.VehicleClass, { foreignKey: 'category' });
	};

	return VehicleClassCategory;
};
