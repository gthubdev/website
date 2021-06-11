# Tracks
INSERT INTO Track (id, name, country, length, map, timezone) VALUES (1, 'Nordschleife', 'Germany', 20.832, '', 'Europe/Brussels');
INSERT INTO Track (id, name, country, length, map, timezone) VALUES (2, 'Mount Panorama Circuit', 'Australia', 6.213, '', 'Australia/Sydney');
INSERT INTO Track (id, name, country, length, map, timezone) VALUES (3, 'Circuit de Spa-Francorchamps', 'United Kingdom of Great Britain and Northern Ireland', 7.004, '', 'Europe/Brussels');
INSERT INTO Track (id, name, country, length, map, timezone) VALUES (4, 'Daytona International Speedway', 'United States of America', 5.73, '', 'America/New_York');
INSERT INTO Track (id, name, country, length, map, timezone) VALUES (5, 'Road America', 'United States of America', 6.515, '', 'America/Chicago');
INSERT INTO Track (id, name, country, length, map, timezone) VALUES (6, 'Surfers Paradise Street Circuit', 'Australia', 2.98, '', 'Australia/Brisbane');
INSERT INTO Track (id, name, country, length, map, timezone) VALUES (7, 'Phillip Island Grand Prix Circuit', 'Australia', 4.445, '', 'Australia/Sydney');

# Events
INSERT INTO Event (id, name, logo, startdate, enddate, track, priority, mainseries) VALUES (1, 'Liqui-Moly Bathurst 12 Hour', 'https://i.imgur.com/DcOb8V2.png', '2021-02-06', '2021-02-07', 2, 2, 5);
INSERT INTO Event (id, name, logo, startdate, enddate, track, priority, mainseries) VALUES (2, 'ADAC TOTAL Nürburgring 24 Hours', 'https://i.imgur.com/5IjaExI.jpg','2021-06-03', '2021-06-06', 1, 1, 4);
INSERT INTO Event (id, name, logo, startdate, enddate, track, priority, mainseries) VALUES (3, 'TOTAL Spa 24 Hours', 'https://i.imgur.com/63tKMPN.png', '2021-07-29', '2021-08-01', 3, 2, 17);
INSERT INTO Event (id, name, startdate, enddate, track, priority, mainseries) VALUES (4, 'Supercheap Auto Bathurst 1000', '2021-10-07', '2021-10-10', 2, 3, 9);
INSERT INTO Event (id, name, startdate, enddate, track, priority, mainseries) VALUES (5, 'Gold Coast 500', '2021-12-04', '2021-12-05', 6, 3, 9);
INSERT INTO Event (id, name, startdate, enddate, track, priority, mainseries) VALUES (6, 'Road Race Showcase at Road America', '2021-08-06', '2021-08-08', 5, 2, 2);
INSERT INTO Event (id, name, startdate, enddate, track, priority, mainseries) VALUES (7, 'Rolex 24 at Daytona', '2021-01-29', '2021-01-31', 4, 1, 2);
INSERT INTO Event (id, name, startdate, enddate, track, priority, mainseries) VALUES (8, '52. ADAC Barbarossapreis (NLS 8)', '2021-09-25', '2021-09-25', 1, 2, 4);

# Bathurst 12 Hours
INSERT INTO SupportSeries (event, series) VALUES (1, 9);
INSERT INTO SupportSeries (event, series) VALUES (1, 14);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Support Race', '2021-02-06 02:00', 1, 14, 60, 1);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Top 10 Shootout', '2021-02-06 06:00', 1, 9, 30, 2);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Race', '2021-02-06 18:45', 1, 5, 720, 1);

# N24
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Qualifying', '2021-06-04 16:00', 2, 4, 120, 2);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Race', '2021-06-05 13:00', 2, 4, 1440, 1);

# Spa 24
INSERT INTO SupportSeries (event, series) VALUES (3, 7);
INSERT INTO SupportSeries (event, series) VALUES (3, 14);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Practice 1', '2021-07-29 10:00', 3, 7, 60, 3);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Practice 1', '2021-07-29 12:00', 3, 17, 60, 3);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Practice 2', '2021-07-29 15:00', 3, 7, 60, 3);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Practice 2', '2021-07-29 16:30', 3, 17, 60, 3);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Practice 1', '2021-07-29 19:00', 3, 14, 60, 3);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Practice 3 (Night practice)', '2021-07-29 22:00', 3, 17, 90, 3);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Qualifying 1', '2021-07-30 08:00', 3, 14, 60, 2);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Pointless Top 3 SST shootout', '2021-07-30 10:00', 3, 7, 30, 2);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Practice 4', '2021-07-30 11:30', 3, 17, 60, 3);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Race 1', '2021-07-30 13:00', 3, 14, 60, 1);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Mega-awesome SST race', '2021-07-30 15:00', 3, 7, 60, 1);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Practice 5', '2021-07-30 17:00', 3, 17, 60, 3);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Qualifying', '2021-07-30 19:45', 3, 17, 60, 2);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Qualifying 2', '2021-07-31 07:00', 3, 14, 30, 2);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Top 30 Qualifying', '2021-07-31 08:00', 3, 17, 45, 2);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Race 2', '2021-07-31 11:00', 3, 14, 60, 1);
INSERT INTO EventSession (name, starttime, event, series, duration, sessiontype) VALUES ('Main Race', '2021-07-31 14:00', 3, 17, 1440, 1);
