module.exports = (sequelize, DataTypes) => {
	const BlogTagRel = sequelize.define('BlogTagRel', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		post: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		tag: {
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
		tableName: 'BlogTagRel',
		timestamps: true,
		index: [
			{ fields: ['post', 'tag'], unique: true }
		]
	});

	BlogTagRel.associate = models => {
		models.BlogTagRel.belongsTo(models.BlogPost, {
			foreignKey: 'post',
			onDelete: 'RESTRICT'
		});
		models.BlogCatRel.belongsTo(models.BlogTag, {
			foreignKey: 'tag',
			onDelete: 'RESTRICT'
		});
	};

	return BlogTagRel;
};
