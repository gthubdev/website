const { BlogCategory, BlogCatRel, BlogTag, BlogTagRel, EventSession, EventSessionType, Track, Series, SeriesType, SupportSeries, User, VehicleClass, VehicleClassCategory } = require('../models/');

module.exports.blogpost = [
	{
		model: User,
		as: 'author',
		attributes: ['name', 'image']
	},
	{
		model: BlogCatRel,
		as: 'categories',
		attributes: ['id'],
		include: [
			{
				model: BlogCategory,
				attributes: ['id', 'name'],
				as: 'category'
			}
		]
	},
	{
		model: BlogTagRel,
		as: 'tags',
		attributes: ['id'],
		include: [
			{
				model: BlogTag,
				attributes: ['id', 'name'],
				as: 'tag'
			}
		]
	}
];

module.exports.event = [
	{
		model: Track,
		attributes: ['id', 'name', 'country', 'timezone', 'length']
	},
	{
		model: Series,
		attributes: ['id', 'name', 'shortname', 'logo', 'thumbnail', 'homepage', 'priority']
	},
	{
		model: SupportSeries,
		attributes: ['id'],
		include: [
			{
				model: Series,
				attributes: ['id', 'name', 'shortname', 'logo', 'thumbnail', 'homepage', 'priority']
			}
		]
	},
	{
		model: EventSession,
		attributes: ['id', 'name', 'starttime', 'duration', 'series_id', 'sessiontype_id'],
		include: [
			{
				model: Series,
				attributes: ['id', 'name', 'shortname', 'logo', 'thumbnail', 'homepage', 'priority']
			},
			{
				model: EventSessionType,
				attributes: ['id', 'name'],
				as: 'type'
			}
		]
	}
];

module.exports.series = [
	{
		model: SeriesType,
		attributes: ['id', 'class_id'],
		include: [
			{
				model: VehicleClass,
				attributes: ['id', 'name', 'category_id'],
				include: [
					{
						model: VehicleClassCategory,
						attributes: ['id', 'name']
					}
				]
			}
		]
	}
];
