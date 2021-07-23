module.exports = (sequelize, DataTypes) => {
	const BlogCatRel = sequelize.define('BlogCatRel', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		post_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		category_id: {
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
		tableName: 'BlogCatRel',
		timestamps: true,
		index: [
			{ fields: ['post', 'category'], unique: true }
		]
	});

	BlogCatRel.associate = models => {
		models.BlogCatRel.belongsTo(models.BlogPost, {
			foreignKey: 'post_id',
			onDelete: 'CASCADE'
		});
		models.BlogCatRel.belongsTo(models.BlogCategory, {
			foreignKey: 'category_id',
			as: 'category',
			onDelete: 'RESTRICT'
		});
	};

	return BlogCatRel;
};
