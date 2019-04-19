INSERT INTO Track (id, name, location, length, map) VALUES (1, "Nordschleife", "Nürburg", 20.832, "");
INSERT INTO Track (id, name, location, length, map) VALUES (2, "Mount Panorama Circuit", "Bathurst", 6.213, "");
INSERT INTO Track (id, name, location, length, map) VALUES (3, "Circuit de Spa-Francorchamps", "Spa-Francorchamps", 7.004, "");

INSERT INTO Series (id, name) VALUES (1, "VLN");
INSERT INTO Series (id, name) VALUES (2, "Intercontinental GT Challenge");
INSERT INTO Series (id, name) VALUES (3, "Blancpain Endurance Cup");
INSERT INTO Series (id, name) VALUES (4, "GT2");

INSERT INTO Event (id, name, startdate, enddate, track) VALUES (1, "Bathurst 12 Hour", "2019-02-03", "2019-02-03", 2);
INSERT INTO Event (id, name, startdate, enddate, track) VALUES (2, "Nürburgring 24 Hours", "2019-06-20", "2019-06-23", 1);
INSERT INTO Event (id, name, startdate, enddate, track) VALUES (3, "Spa 24 Hours", "2019-07-26", "2019-07-28", 3);

INSERT INTO EventSession (name, starttime, endtime, event, series) VALUES ("Top 10 Shootout", "2019-02-02 06:30", "2019-02-02 07:15", 1, 2);
INSERT INTO EventSession (name, starttime, endtime, event, series) VALUES ("Race", "2019-02-02 19:45", "2019-02-03 07:45", 1, 2);

INSERT INTO EventSession (name, starttime, endtime, event, series) VALUES ("Qualifying", "2019-06-21 14:00", "2019-06-21 16:00", 2, 1);
INSERT INTO EventSession (name, starttime, endtime, event, series) VALUES ("Race", "2019-06-22 15:00", "2019-06-23 15:00", 2, 1);

INSERT INTO EventSession (name, starttime, endtime, event, series) VALUES ("Top 3 GT2 shootout", "2019-07-26 14:00", "2019-07-26 15:00", 3, 4);
INSERT INTO EventSession (name, starttime, endtime, event, series) VALUES ("Inaugural GT2 race", "2019-07-26 18:00", "2019-07-26 19:00", 3, 4);
INSERT INTO EventSession (name, starttime, endtime, event, series) VALUES ("Top 30 Qualifying", "2019-07-27 10:00", "2019-07-27 11:00", 3, 3);
INSERT INTO EventSession (name, starttime, endtime, event, series) VALUES ("Race", "2019-07-27 16:00", "2019-07-28 16:00", 3, 3);
