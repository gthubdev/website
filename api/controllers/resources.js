const { Event, EventSession, Track, Series, SupportSeries, SeriesType, VehicleClass, VehicleClassCategory } = require('../models/');
const dateutil = require('../util/dateutil');
const util = require('../util/util');

module.exports.getResources = async (req, res) => {
	try {
		const [events, series, tracks, vehicleclasscategories, vehicleclasses] = await Promise.all([
			Event.findAll({
				include: [
					{ model: Track },
					{ model: Series },
					{
						model: SupportSeries,
						include: [
							{ model: Series }
						]
					},
					{
						model: EventSession,
						include: [
							{ model: Series }
						]
					}
				],
				order: [
					['startdate', 'ASC'],
					[EventSession, 'starttime', 'ASC']
				]
			}),
			Series.findAll({
				include: [
					{
						model: SeriesType,
						include: [
							{
								model: VehicleClass,
								include: [
									{ model: VehicleClassCategory }
								]
							}
						]
					}
				],
				order: [
					['name', 'ASC']
				]
			}),
			Track.findAll({
				order: [
					['name', 'ASC']
				]
			}),
			VehicleClassCategory.findAll({
				include: [
					{ model: VehicleClass }
				],
				order: [
					['name', 'ASC']
				]
			}),
			VehicleClass.findAll({
				include: [
					{ model: VehicleClassCategory }
				],
				order: [
					['name', 'ASC']
				]
			})
		]);

		const data = {
			events,
			series,
			tracks,
			vehicleclasscategories,
			vehicleclasses,
			timezones: dateutil.timezones
		};

		res.json(data);
	} catch (err) {
		util.error(req, res, err);
	}
};
