module.exports = (sequelize, DataTypes) => {
	const BlogTag = sequelize.define('BlogTag', {
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
		tableName: 'BlogTag',
		timestamps: true
	});

	BlogTag.associate = models => {
		models.BlogTag.hasMany(models.BlogTagRel, {
			foreignKey: 'tag'
		});
	};

	return BlogTag;
};
