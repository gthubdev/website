INSERT INTO Usertype (id, name) VALUES (1, 'Admin');
INSERT INTO Usertype (id, name) VALUES (2, 'TV Crew');

# Login for admin/admin
INSERT INTO User (username, password, name, usertype) VALUES ('admin', '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.', 'Admin', 1);
# Login for dan/dan
INSERT INTO User (username, password, name, usertype) VALUES ('dan', '$2a$10$mefD9jPsx1dxsm3RlHWQOOu.yLiUWkHk2QWPvTVLOgyPoxkTyILGG', 'Dan', 2);
# Login for stuff/stuff
INSERT INTO User (username, password, name, usertype) VALUES ('stuff', '$2a$10$Kk7ipyDS/tjcHzOGbaBfg.yc1nXoniOrLaXJsKuko2eU0vpIATjFS', 'StuffAndMore', 2);

# Vehicle Classes
INSERT INTO VehicleClassCategory (id, name) VALUES (1, 'Sportscar');
INSERT INTO VehicleClass (id, name, category) VALUES (1, 'GT500', 1);
INSERT INTO VehicleClass (id, name, category) VALUES (2, 'GTE/GTLM', 1);
INSERT INTO VehicleClass (id, name, category) VALUES (3, 'GT3', 1);
INSERT INTO VehicleClass (id, name, category) VALUES (4, 'GT2', 1);
INSERT INTO VehicleClass (id, name, category) VALUES (5, 'GT4', 1);
INSERT INTO VehicleClass (id, name, category) VALUES (6, 'Cup Series', 1);
INSERT INTO VehicleClass (id, name, category) VALUES (7, 'Other Sportscar', 1);

INSERT INTO VehicleClassCategory (id, name) VALUES (2, 'Prototype');
INSERT INTO VehicleClass (id, name, category) VALUES (8, 'LMHC', 2);
INSERT INTO VehicleClass (id, name, category) VALUES (9, 'LMP1', 2);
INSERT INTO VehicleClass (id, name, category) VALUES (10, 'DPi', 2);
INSERT INTO VehicleClass (id, name, category) VALUES (11, 'LMP2', 2);
INSERT INTO VehicleClass (id, name, category) VALUES (12, 'LMP3', 2);
INSERT INTO VehicleClass (id, name, category) VALUES (13, 'Other Prototypes', 2);

INSERT INTO VehicleClassCategory (id, name) VALUES (3, 'Open Wheeled');
INSERT INTO VehicleClass (id, name, category) VALUES (14, 'F1', 3);
INSERT INTO VehicleClass (id, name, category) VALUES (15, 'Indycar', 3);
INSERT INTO VehicleClass (id, name, category) VALUES (16, 'F2', 3);
INSERT INTO VehicleClass (id, name, category) VALUES (17, 'F3', 3);
INSERT INTO VehicleClass (id, name, category) VALUES (18, 'F3 National', 3);
INSERT INTO VehicleClass (id, name, category) VALUES (19, 'F4', 3);
INSERT INTO VehicleClass (id, name, category) VALUES (20, 'Formula E', 3);
INSERT INTO VehicleClass (id, name, category) VALUES (21, 'F2000', 3);
INSERT INTO VehicleClass (id, name, category) VALUES (22, 'Formula Renault', 3);
INSERT INTO VehicleClass (id, name, category) VALUES (23, 'Other Open Wheeled', 3);

INSERT INTO VehicleClassCategory (id, name) VALUES (4, 'Touring Car');
INSERT INTO VehicleClass (id, name, category) VALUES (24, 'WTCR', 4);
INSERT INTO VehicleClass (id, name, category) VALUES (25, 'TCR', 4);
INSERT INTO VehicleClass (id, name, category) VALUES (26, 'NGTC', 4);
INSERT INTO VehicleClass (id, name, category) VALUES (27, 'Supercars', 4);
INSERT INTO VehicleClass (id, name, category) VALUES (28, 'DTM', 4);
INSERT INTO VehicleClass (id, name, category) VALUES (29, 'Group N', 4);
INSERT INTO VehicleClass (id, name, category) VALUES (30, 'Other Touring Car', 4);

INSERT INTO VehicleClassCategory (id, name) VALUES (5, 'Stock Car');
INSERT INTO VehicleClass (id, name, category) VALUES (31, 'NASCAR', 5);
INSERT INTO VehicleClass (id, name, category) VALUES (32, 'ARCA', 5);
INSERT INTO VehicleClass (id, name, category) VALUES (33, 'NASCAR National', 5);
INSERT INTO VehicleClass (id, name, category) VALUES (34, 'Other Stock Car', 5);

INSERT INTO VehicleClassCategory (id, name) VALUES (6, 'Other');
INSERT INTO VehicleClass (id, name, category) VALUES (35, 'Rally', 6);
INSERT INTO VehicleClass (id, name, category) VALUES (36, 'Rallycross', 6);
INSERT INTO VehicleClass (id, name, category) VALUES (37, 'Rally Raid', 6);
INSERT INTO VehicleClass (id, name, category) VALUES (38, 'Motorbikes', 6);
INSERT INTO VehicleClass (id, name, category) VALUES (39, 'Truck Racing', 6);
INSERT INTO VehicleClass (id, name, category) VALUES (40, 'Hill Climb', 6);
INSERT INTO VehicleClass (id, name, category) VALUES (41, 'Historics', 6);
INSERT INTO VehicleClass (id, name, category) VALUES (42, 'Misc', 6);
