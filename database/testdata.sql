INSERT INTO Track (id, name, country, length, map, timezone) VALUES (1, 'Nordschleife', 'Germany', 20.832, '', 'Europe/Brussels');
INSERT INTO Track (id, name, country, length, map, timezone) VALUES (2, 'Mount Panorama Circuit', 'Australia', 6.213, '', 'Australia/Sydney');
INSERT INTO Track (id, name, country, length, map, timezone) VALUES (3, 'Circuit de Spa-Francorchamps', 'United Kingdom of Great Britain and Northern Ireland', 7.004, '', 'Europe/Brussels');
INSERT INTO Track (id, name, country, length, map, timezone) VALUES (4, 'Daytona International Speedway', 'United States of America', 5.73, '', 'America/New_York');
INSERT INTO Track (id, name, country, length, map, timezone) VALUES (5, 'Road America', 'United States of America', 6.515, '', 'America/Chicago');
INSERT INTO Track (id, name, country, length, map, timezone) VALUES (6, 'Surfers Paradise Street Circuit', 'Australia', 2.98, '', 'Australia/Brisbane');
INSERT INTO Track (id, name, country, length, map, timezone) VALUES (7, 'Phillip Island Grand Prix Circuit', 'Australia', 4.445, '', 'Australia/Sydney');

INSERT INTO Series (id, name, shortname, priority, logo) VALUES (1, 'Nürburgring Langstrecken Serie', 'NLS', 1, 'https://i.imgur.com/NI66lJP.jpg');
INSERT INTO SeriesType (series, class) VALUES (1, 3);
INSERT INTO SeriesType (series, class) VALUES (1, 5);
INSERT INTO SeriesType (series, class) VALUES (1, 25);
INSERT INTO SeriesType (series, class) VALUES (1, 29);
INSERT INTO Series (id, name, shortname, priority, logo) VALUES (2, 'Intercontinental GT Challenge', 'IGTC', 2, 'https://i.imgur.com/NgOtwfZ.png');
INSERT INTO SeriesType (series, class) VALUES (2, 3);
INSERT INTO Series (id, name, shortname, priority, logo) VALUES (3, 'GT World Challenge Europe Endurance Cup', 'GTWCEEC', 2, 'https://i.imgur.com/GtPfM0u.png');
INSERT INTO SeriesType (series, class) VALUES (3, 3);
INSERT INTO Series (id, name, shortname, priority, logo) VALUES (4, 'GT2 Sports Club', 'GT2', 2, 'https://i.imgur.com/ozCMUyY.png');
INSERT INTO SeriesType (series, class) VALUES (4, 4);
INSERT INTO Series (id, name, shortname, priority, logo) VALUES (5, 'IMSA WeatherTech SportsCar Championship', 'WSCC', 1, 'https://i.imgur.com/t41MJ4Y.png');
INSERT INTO SeriesType (series, class) VALUES (5, 10);
INSERT INTO SeriesType (series, class) VALUES (5, 11);
INSERT INTO SeriesType (series, class) VALUES (5, 2);
INSERT INTO SeriesType (series, class) VALUES (5, 3);
INSERT INTO Series (id, name, shortname, priority, logo) VALUES (6, 'Virgin Australia Supercars Championship', 'V8SC', 3, 'https://i.imgur.com/qfHtote.png');
INSERT INTO SeriesType (series, class) VALUES (6, 27);
INSERT INTO Series (id, name, shortname, priority, logo) VALUES (7, 'SUPER GT', 'SGT', 1, 'https://i.imgur.com/biqooQ9.png');
INSERT INTO SeriesType (series, class) VALUES (7, 1);
INSERT INTO SeriesType (series, class) VALUES (7, 3);
INSERT INTO Series (id, name, shortname, priority, logo) VALUES (8, 'C1 Racing Club', 'C1', 4, 'https://i.imgur.com/FCHlD04.jpg');
INSERT INTO SeriesType (series, class) VALUES (8, 30);

INSERT INTO Event (id, name, logo, startdate, enddate, track, priority, mainseries) VALUES (1, 'Liqui-Moly Bathurst 12 Hour', 'https://i.imgur.com/DcOb8V2.png', '2021-02-07', '2021-02-08', 2, 2, 2);
INSERT INTO Event (id, name, logo, startdate, enddate, track, priority, mainseries) VALUES (2, 'ADAC TOTAL Nürburgring 24 Hours', 'https://i.imgur.com/5IjaExI.jpg','2021-06-03', '2021-06-06', 1, 1, 1);
INSERT INTO Event (id, name, logo, startdate, enddate, track, priority, mainseries) VALUES (3, 'TOTAL Spa 24 Hours', 'https://i.imgur.com/63tKMPN.png', '2021-07-29', '2021-08-01', 3, 2, 3);
INSERT INTO Event (id, name, startdate, enddate, track, priority, mainseries) VALUES (4, 'Supercheap Auto Bathurst 1000', '2021-10-07', '2021-10-10', 2, 3, 6);
INSERT INTO Event (id, name, startdate, enddate, track, priority, mainseries) VALUES (5, 'Gold Coast 500', '2021-12-04', '2021-12-05', 6, 3, 6);
INSERT INTO Event (id, name, startdate, enddate, track, priority, mainseries) VALUES (6, 'Road Race Showcase at Road America', '2021-08-06', '2021-08-08', 5, 2, 5);
INSERT INTO Event (id, name, startdate, enddate, track, priority, mainseries) VALUES (7, 'Rolex 24 at Daytona', '2021-01-29', '2021-01-31', 4, 1, 5);
INSERT INTO Event (id, name, startdate, enddate, track, priority, mainseries) VALUES (8, '52. ADAC Barbarossapreis (NLS 8)', '2021-09-25', '2021-09-25', 1, 2, 1);

# Bathurst 12 Hours
INSERT INTO SupportSeries (event, series) VALUES (1, 6);
INSERT INTO SupportSeries (event, series) VALUES (1, 4);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('GT2 Support Race', '2021-02-07 02:00', 1, 4, 60);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Top 10 Shootout', '2021-02-07 06:00', 1, 6, 30);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Race', '2021-02-07 18:45', 1, 2, 720);

# N24
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Qualifying', '2021-06-04 16:00', 2, 1, 120);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Race', '2021-06-05 13:00', 2, 1, 1440);

# Spa 24
INSERT INTO SupportSeries (event, series) VALUES (3, 4);
INSERT INTO SupportSeries (event, series) VALUES (3, 8);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Practice 1', '2021-07-29 10:00', 3, 4, 60);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Practice 1', '2021-07-29 12:00', 3, 3, 60);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Practice 2', '2021-07-29 15:00', 3, 4, 60);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Practice 2', '2021-07-29 16:30', 3, 3, 60);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Practice 1', '2021-07-29 19:00', 3, 8, 60);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Practice 3 (Night practice)', '2021-07-29 22:00', 3, 3, 90);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Qualifying 1', '2021-07-30 08:00', 3, 8, 60);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Pointless Top 3 GT2 shootout', '2021-07-30 10:00', 3, 4, 30);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Practice 4', '2021-07-30 11:30', 3, 3, 60);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Race 1', '2021-07-30 13:00', 3, 8, 60);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Another shitty GT2 race', '2021-07-30 15:00', 3, 4, 60);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Practice 5', '2021-07-30 17:00', 3, 3, 60);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Qualifying', '2021-07-30 19:45', 3, 3, 60);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Qualifying 2', '2021-07-31 07:00', 3, 8, 30);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Top 30 Qualifying', '2021-07-31 08:00', 3, 3, 45);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Race 2', '2021-07-31 11:00', 3, 8, 60);
INSERT INTO EventSession (name, starttime, event, series, duration) VALUES ('Race', '2021-07-31 14:00', 3, 3, 1440);
