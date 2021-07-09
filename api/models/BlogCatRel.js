module.exports = (sequelize, DataTypes) => {
	const BlogCatRel = sequelize.define('BlogCatRel', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		post: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		category: {
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
			foreignKey: 'post',
			onDelete: 'RESTRICT'
		});
		models.BlogCatRel.belongsTo(models.BlogCategory, {
			foreignKey: 'category',
			onDelete: 'RESTRICT'
		});
	};

	return BlogCatRel;
};
