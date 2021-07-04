module.exports = (sequelize, DataTypes) => {
	const BlogPost = sequelize.define('BlogPost', {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		headline: DataTypes.STRING(1023),
		content: DataTypes.TEXT('long'),
		image: DataTypes.STRING,
		author: {
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
		tableName: 'BlogPost',
		timestamps: true
	});

	BlogPost.associate = models => {
		models.BlogPost.belongsTo(models.User, {
			foreignKey: 'author',
			onDelete: 'RESTRICT'
		});
		models.BlogPost.hasMany(models.BlogCatRel, {
			foreignKey: 'post'
		});
		models.BlogPost.hasMany(models.BlogTagRel, {
			foreignKey: 'post'
		});
	};

	return BlogPost;
};
