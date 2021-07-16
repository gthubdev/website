const { EventSession, EventSessionType, Track, Series, SeriesType, SupportSeries, VehicleClass, VehicleClassCategory } = require('../models/');

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
		attributes: ['id', 'name', 'starttime', 'duration', 'series', 'sessiontype'],
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
		attributes: ['id', 'class'],
		include: [
			{
				model: VehicleClass,
				attributes: ['id', 'name', 'category'],
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
