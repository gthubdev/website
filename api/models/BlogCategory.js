module.exports = (sequelize, DataTypes) => {
	const BlogCategory = sequelize.define('BlogCategory', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			defaultValue: ''
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
		tableName: 'BlogCategory',
		timestamps: true
	});

	BlogCategory.associate = models => {
		models.BlogCategory.hasMany(models.BlogCatRel, {
			foreignKey: 'category_id',
			as: 'category',
			onDelete: 'RESTRICT'
		});
	};

	return BlogCategory;
};
