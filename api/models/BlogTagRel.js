module.exports = (sequelize, DataTypes) => {
	const BlogTagRel = sequelize.define('BlogTagRel', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		post_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		tag_id: {
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
			foreignKey: 'post_id',
			onDelete: 'CASCADE'
		});
		models.BlogTagRel.belongsTo(models.BlogTag, {
			foreignKey: 'tag_id',
			as: 'tag',
			onDelete: 'RESTRICT'
		});
	};

	return BlogTagRel;
};
