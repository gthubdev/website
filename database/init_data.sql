INSERT INTO Usertype (id, name) VALUES (1, 'Admin');
INSERT INTO Usertype (id, name) VALUES (2, 'TV Crew');

# Password is 'admin'
INSERT INTO User (username, password, name, usertype) VALUES ('admin', '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.', 'Admin', 1);

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
INSERT INTO VehicleClass (id, name, category) VALUES (8, 'LMP1', 2);
INSERT INTO VehicleClass (id, name, category) VALUES (9, 'DPi', 2);
INSERT INTO VehicleClass (id, name, category) VALUES (10, 'LMP2', 2);
INSERT INTO VehicleClass (id, name, category) VALUES (11, 'LMP3', 2);
INSERT INTO VehicleClass (id, name, category) VALUES (12, 'Other Prototypes', 2);

INSERT INTO VehicleClassCategory (id, name) VALUES (3, 'Open Wheeled');
INSERT INTO VehicleClass (id, name, category) VALUES (13, 'F1', 3);
INSERT INTO VehicleClass (id, name, category) VALUES (14, 'Indycar', 3);
INSERT INTO VehicleClass (id, name, category) VALUES (15, 'F2', 3);
INSERT INTO VehicleClass (id, name, category) VALUES (16, 'F3', 3);
INSERT INTO VehicleClass (id, name, category) VALUES (17, 'F3 National', 3);
INSERT INTO VehicleClass (id, name, category) VALUES (18, 'F4', 3);
INSERT INTO VehicleClass (id, name, category) VALUES (19, 'Formula E', 3);
INSERT INTO VehicleClass (id, name, category) VALUES (20, 'F2000', 3);
INSERT INTO VehicleClass (id, name, category) VALUES (21, 'Formula Renault', 3);
INSERT INTO VehicleClass (id, name, category) VALUES (22, 'Other Open Wheeled', 3);

INSERT INTO VehicleClassCategory (id, name) VALUES (4, 'Touring Car');
INSERT INTO VehicleClass (id, name, category) VALUES (23, 'WTCR', 4);
INSERT INTO VehicleClass (id, name, category) VALUES (24, 'TCR', 4);
INSERT INTO VehicleClass (id, name, category) VALUES (25, 'NGTC', 4);
INSERT INTO VehicleClass (id, name, category) VALUES (26, 'Supercars', 4);
INSERT INTO VehicleClass (id, name, category) VALUES (27, 'DTM', 4);
INSERT INTO VehicleClass (id, name, category) VALUES (28, 'Group N', 4);
INSERT INTO VehicleClass (id, name, category) VALUES (29, 'Other Touring Car', 4);

INSERT INTO VehicleClassCategory (id, name) VALUES (5, 'Stock Car');
INSERT INTO VehicleClass (id, name, category) VALUES (30, 'NASCAR', 5);
INSERT INTO VehicleClass (id, name, category) VALUES (31, 'ARCA', 5);
INSERT INTO VehicleClass (id, name, category) VALUES (32, 'NASCAR National', 5);
INSERT INTO VehicleClass (id, name, category) VALUES (33, 'Other Stock Car', 5);

INSERT INTO VehicleClassCategory (id, name) VALUES (6, 'Other');
INSERT INTO VehicleClass (id, name, category) VALUES (34, 'Rally', 6);
INSERT INTO VehicleClass (id, name, category) VALUES (35, 'Rallycross', 6);
INSERT INTO VehicleClass (id, name, category) VALUES (36, 'Rally Raid', 6);
INSERT INTO VehicleClass (id, name, category) VALUES (37, 'Motorbikes', 6);
INSERT INTO VehicleClass (id, name, category) VALUES (38, 'Truck Racing', 6);
INSERT INTO VehicleClass (id, name, category) VALUES (39, 'Hill Climb', 6);
INSERT INTO VehicleClass (id, name, category) VALUES (40, 'Historics', 6);
INSERT INTO VehicleClass (id, name, category) VALUES (41, 'Misc', 6);
