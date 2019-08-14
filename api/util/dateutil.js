const moment = require('moment-timezone');

const tz_strings = {
	'Etc/GMT+12': 'International Date Line West',
	'Pacific/Midway': 'Midway Island, Samoa',
	'Pacific/Honolulu': 'Hawaii',
	'America/Juneau': 'Alaska',
	'America/Los_Angeles': 'Pacific Time (US and Canada); Tijuana',
	'America/Denver': 'Mountain Time (US and Canada)',
	'America/Chihuahua': 'Chihuahua, La Paz, Mazatlan',
	'America/Phoenix': 'Arizona',
	'America/Chicago': 'Central Time (US and Canada)',
	'America/Regina': 'Saskatchewan',
	'America/Mexico_City': 'Guadalajara, Mexico City, Monterrey',
	'America/Belize': 'Central America',
	'America/New_York': 'Eastern Time (US and Canada)',
	'America/Indiana/Indianapolis': 'Indiana (East)',
	'America/Bogota': 'Bogota, Lima, Quito',
	'America/Glace_Bay': 'Atlantic Time (Canada)',
	'America/Caracas': 'Caracas, La Paz',
	'America/Santiago': 'Santiago',
	'America/St_Johns': 'Newfoundland and Labrador',
	'America/Sao_Paulo': 'Brasilia',
	'America/Argentina/Buenos_Aires': 'Buenos Aires, Georgetown',
	'America/Godthab': 'Greenland',
	'Etc/GMT+2': 'Mid-Atlantic',
	'Atlantic/Azores': 'Azores',
	'Atlantic/Cape_Verde': 'Cape Verde Islands',
	'UTC': 'UTC',
	'Europe/London': 'Dublin, Edinburgh, Lisbon, London',
	'Africa/Casablanca': 'Casablanca, Monrovia',
	'Atlantic/Canary': 'Canary Islands',
	'Europe/Belgrade': 'Belgrade, Bratislava, Budapest, Ljubljana, Prague',
	'Europe/Sarajevo': 'Sarajevo, Skopje, Warsaw, Zagreb',
	'Europe/Brussels': 'Brussels, Copenhagen, Madrid, Paris',
	'Europe/Amsterdam': 'Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna',
	'Africa/Algiers': 'West Central Africa',
	'Europe/Bucharest': 'Bucharest',
	'Africa/Cairo': 'Cairo',
	'Europe/Helsinki': 'Helsinki, Kiev, Riga, Sofia, Tallinn, Vilnius',
	'Europe/Athens': 'Athens, Istanbul, Minsk',
	'Asia/Jerusalem': 'Jerusalem',
	'Africa/Harare': 'Harare, Pretoria',
	'Europe/Moscow': 'Moscow, St. Petersburg, Volgograd',
	'Asia/Kuwait': 'Kuwait, Riyadh',
	'Africa/Nairobi': 'Nairobi',
	'Asia/Baghdad': 'Baghdad',
	'Asia/Tehran': 'Tehran',
	'Asia/Dubai': 'Abu Dhabi, Muscat',
	'Asia/Baku': 'Baku, Tbilisi, Yerevan',
	'Asia/Kabul': 'Kabul',
	'Asia/Yekaterinburg': 'Ekaterinburg',
	'Asia/Karachi': 'Islamabad, Karachi, Tashkent',
	'Asia/Kolkata': 'Chennai, Kolkata, Mumbai, New Delhi',
	'Asia/Kathmandu': 'Kathmandu',
	'Asia/Dhaka': 'Astana, Dhaka',
	'Asia/Colombo': 'Sri Jayawardenepura',
	'Asia/Almaty': 'Almaty, Novosibirsk',
	'Asia/Rangoon': 'Yangon Rangoon',
	'Asia/Bangkok': 'Bangkok, Hanoi, Jakarta',
	'Asia/Krasnoyarsk': 'Krasnoyarsk',
	'Asia/Shanghai': 'Beijing, Chongqing, Hong Kong SAR, Urumqi',
	'Asia/Kuala_Lumpur': 'Kuala Lumpur, Singapore',
	'Asia/Taipei': 'Taipei',
	'Australia/Perth': 'Perth',
	'Asia/Irkutsk': 'Irkutsk, Ulaanbaatar',
	'Asia/Seoul': 'Seoul',
	'Asia/Tokyo': 'Osaka, Sapporo, Tokyo',
	'Asia/Yakutsk': 'Yakutsk',
	'Australia/Darwin': 'Darwin',
	'Australia/Adelaide': 'Adelaide',
	'Australia/Sydney': 'Canberra, Melbourne, Sydney',
	'Australia/Brisbane': 'Brisbane',
	'Australia/Hobart': 'Hobart',
	'Asia/Vladivostok': 'Vladivostok',
	'Pacific/Guam': 'Guam, Port Moresby',
	'Asia/Magadan': 'Magadan, Solomon Islands, New Caledonia',
	'Pacific/Fiji': 'Fiji Islands, Kamchatka, Marshall Islands',
	'Pacific/Auckland': 'Auckland, Wellington',
	'Pacific/Tongatapu': 'Nuku\'alofa'
};
module.exports.tz_strings = tz_strings;

let tz_array = [];
Object.entries(tz_strings).forEach(
	([key, value]) => {
		const tmp = {
			name: key,
			desc: value
		};
		tz_array.push(tmp);
	}
);
module.exports.tz_array = tz_array;


// filter the timezones we want
const tmp_strings = moment.tz.names()
	.filter(tz => {
		return Object.prototype.hasOwnProperty.call(tz_strings, tz);
	});

// map the timezones to the UTC offset
let tz_offsets = [];
tmp_strings.forEach(tz => {
	tz_offsets.push({
		name: tz,
		offset: moment.tz(tz).utcOffset()
	});
});

// sort the list by UTC offset
tz_offsets.sort((a,b) => {
	return a.offset - b.offset;
});
module.exports.tz_offsets = tz_offsets;
