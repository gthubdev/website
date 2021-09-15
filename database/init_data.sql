INSERT INTO Usertype (id, name) VALUES (1, 'Admin');
INSERT INTO Usertype (id, name) VALUES (2, 'Staff');

# Login for admin/admin
INSERT INTO User (username, password, name, usertype_id) VALUES ('admin', '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.', 'Admin', 1);
# Login for dan/dan
INSERT INTO User (username, password, name, usertype_id) VALUES ('dan', '$2a$10$mefD9jPsx1dxsm3RlHWQOOu.yLiUWkHk2QWPvTVLOgyPoxkTyILGG', 'Dan', 2);
# Login for stuff/stuff
INSERT INTO User (username, password, name, usertype_id) VALUES ('stuff', '$2a$10$Kk7ipyDS/tjcHzOGbaBfg.yc1nXoniOrLaXJsKuko2eU0vpIATjFS', 'StuffAndMore', 2);

# Vehicle Classes
INSERT INTO VehicleClassCategory (id, name) VALUES (1, 'Sportscar');
INSERT INTO VehicleClass (id, name, category_id) VALUES (1, 'GT500', 1);
INSERT INTO VehicleClass (id, name, category_id) VALUES (2, 'GTE/GTLM', 1);
INSERT INTO VehicleClass (id, name, category_id) VALUES (3, 'GT3', 1);
INSERT INTO VehicleClass (id, name, category_id) VALUES (4, 'GT2', 1);
INSERT INTO VehicleClass (id, name, category_id) VALUES (5, 'GT4', 1);
INSERT INTO VehicleClass (id, name, category_id) VALUES (6, 'Cup Series', 1);
INSERT INTO VehicleClass (id, name, category_id) VALUES (7, 'Other Sportscar', 1);

INSERT INTO VehicleClassCategory (id, name) VALUES (2, 'Prototype');
INSERT INTO VehicleClass (id, name, category_id) VALUES (8, 'Hypercar', 2);
INSERT INTO VehicleClass (id, name, category_id) VALUES (9, 'LMDh', 2);
INSERT INTO VehicleClass (id, name, category_id) VALUES (10, 'LMP1', 2);
INSERT INTO VehicleClass (id, name, category_id) VALUES (11, 'DPi', 2);
INSERT INTO VehicleClass (id, name, category_id) VALUES (12, 'LMP2', 2);
INSERT INTO VehicleClass (id, name, category_id) VALUES (13, 'LMP3', 2);
INSERT INTO VehicleClass (id, name, category_id) VALUES (14, 'Other Prototypes', 2);

INSERT INTO VehicleClassCategory (id, name) VALUES (3, 'Open Wheeled');
INSERT INTO VehicleClass (id, name, category_id) VALUES (15, 'F1', 3);
INSERT INTO VehicleClass (id, name, category_id) VALUES (16, 'Indycar', 3);
INSERT INTO VehicleClass (id, name, category_id) VALUES (17, 'F2', 3);
INSERT INTO VehicleClass (id, name, category_id) VALUES (18, 'F3', 3);
INSERT INTO VehicleClass (id, name, category_id) VALUES (19, 'F3 National', 3);
INSERT INTO VehicleClass (id, name, category_id) VALUES (20, 'F4', 3);
INSERT INTO VehicleClass (id, name, category_id) VALUES (21, 'Formula E', 3);
INSERT INTO VehicleClass (id, name, category_id) VALUES (22, 'F2000', 3);
INSERT INTO VehicleClass (id, name, category_id) VALUES (23, 'Formula Renault', 3);
INSERT INTO VehicleClass (id, name, category_id) VALUES (24, 'Other Open Wheeled', 3);

INSERT INTO VehicleClassCategory (id, name) VALUES (4, 'Touring Car');
INSERT INTO VehicleClass (id, name, category_id) VALUES (25, 'WTCR', 4);
INSERT INTO VehicleClass (id, name, category_id) VALUES (26, 'TCR', 4);
INSERT INTO VehicleClass (id, name, category_id) VALUES (27, 'NGTC', 4);
INSERT INTO VehicleClass (id, name, category_id) VALUES (28, 'Supercars', 4);
INSERT INTO VehicleClass (id, name, category_id) VALUES (29, 'DTM', 4);
INSERT INTO VehicleClass (id, name, category_id) VALUES (30, 'Group N', 4);
INSERT INTO VehicleClass (id, name, category_id) VALUES (31, 'Other Touring Car', 4);

INSERT INTO VehicleClassCategory (id, name) VALUES (5, 'Stock Car');
INSERT INTO VehicleClass (id, name, category_id) VALUES (32, 'NASCAR', 5);
INSERT INTO VehicleClass (id, name, category_id) VALUES (33, 'ARCA', 5);
INSERT INTO VehicleClass (id, name, category_id) VALUES (34, 'NASCAR National', 5);
INSERT INTO VehicleClass (id, name, category_id) VALUES (35, 'Other Stock Car', 5);

INSERT INTO VehicleClassCategory (id, name) VALUES (7, 'Sliding Car');
INSERT INTO VehicleClass (id, name, category) VALUES (43, 'Bobsleigh', 7);
INSERT INTO VehicleClass (id, name, category) VALUES (44, 'Luge', 7);
INSERT INTO VehicleClass (id, name, category) VALUES (45, 'Skeleton', 7);
INSERT INTO VehicleClass (id, name, category) VALUES (46, 'Other', 7);

INSERT INTO VehicleClassCategory (id, name) VALUES (6, 'Other');
INSERT INTO VehicleClass (id, name, category_id) VALUES (36, 'Rally', 6);
INSERT INTO VehicleClass (id, name, category_id) VALUES (37, 'Rallycross', 6);
INSERT INTO VehicleClass (id, name, category_id) VALUES (38, 'Rally Raid', 6);
INSERT INTO VehicleClass (id, name, category_id) VALUES (39, 'Motorbikes', 6);
INSERT INTO VehicleClass (id, name, category_id) VALUES (40, 'Truck Racing', 6);
INSERT INTO VehicleClass (id, name, category_id) VALUES (41, 'Hill Climb', 6);
INSERT INTO VehicleClass (id, name, category_id) VALUES (42, 'Historics', 6);
INSERT INTO VehicleClass (id, name, category_id) VALUES (43, 'Misc', 6);

# Series and Types
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (1, 'FIA World Endurance Championship', 'WEC', 'https://cdn.discordapp.com/attachments/813887392171294740/813888374363783218/WEC.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318602013769758/WEC.png', 1);
INSERT INTO SeriesType (series_id, class_id) VALUES (1, 8);
INSERT INTO SeriesType (series_id, class_id) VALUES (1, 10);
INSERT INTO SeriesType (series_id, class_id) VALUES (1, 12);
INSERT INTO SeriesType (series_id, class_id) VALUES (1, 2);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (2, 'IMSA WeatherTech SportsCar Championship', 'WSCC', 'https://cdn.discordapp.com/attachments/813887392171294740/813887789811761192/WTSCC.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318621646913556/WTSCC.png', 1);
INSERT INTO SeriesType (series_id, class_id) VALUES (2, 2);
INSERT INTO SeriesType (series_id, class_id) VALUES (2, 3);
INSERT INTO SeriesType (series_id, class_id) VALUES (2, 11);
INSERT INTO SeriesType (series_id, class_id) VALUES (2, 12);
INSERT INTO SeriesType (series_id, class_id) VALUES (2, 13);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (3, 'European Le Mans Series', 'ELMS', 'https://cdn.discordapp.com/attachments/813887392171294740/813888343078469682/ELMS.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318231863033937/ELMS.png', 1);
INSERT INTO SeriesType (series_id, class_id) VALUES (3, 12);
INSERT INTO SeriesType (series_id, class_id) VALUES (3, 13);
INSERT INTO SeriesType (series_id, class_id) VALUES (3, 2);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (4, 'Nürburgring Langstrecken Serie', 'NLS', 'https://cdn.discordapp.com/attachments/813887392171294740/818642811892138004/VLN.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318588445982790/VLN.png', 1);
INSERT INTO SeriesType (series_id, class_id) VALUES (4, 3);
INSERT INTO SeriesType (series_id, class_id) VALUES (4, 5);
INSERT INTO SeriesType (series_id, class_id) VALUES (4, 6);
INSERT INTO SeriesType (series_id, class_id) VALUES (4, 26);
INSERT INTO SeriesType (series_id, class_id) VALUES (4, 31);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (5, 'Intercontinental GT Challenge', 'IGTC', 'https://cdn.discordapp.com/attachments/813887392171294740/818643256999936030/ICGTC.pngFLe man', 'https://cdn.discordapp.com/attachments/814318055294631996/814318390256074773/ICGTC.png', 1);
INSERT INTO SeriesType (series_id, class_id) VALUES (5, 3);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (6, 'British Touring Car Championship', 'BTCC', 'https://cdn.discordapp.com/attachments/813887392171294740/813888531491586078/BTCC.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318197540913192/BTCC.png', 1);
INSERT INTO SeriesType (series_id, class_id) VALUES (6, 27);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (7, 'Stadium Super Trucks', 'SST', 'https://cdn.discordapp.com/attachments/813887392171294740/813887958662381600/SST.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318545445978112/SST.png', 1);
INSERT INTO SeriesType (series_id, class_id) VALUES (7, 40);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (8, 'FIA GT World Cup', 'GTWC', 'https://cdn.discordapp.com/attachments/813887392171294740/813888219488714822/GTWC.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318384975970315/GTWC.png', 1);
INSERT INTO SeriesType (series_id, class_id) VALUES (8, 3);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (9, 'Repco Supercars Championship', 'V8SC', 'https://cdn.discordapp.com/attachments/813887392171294740/813888555851841586/VASC.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318584121655296/VASC.png', 2);
INSERT INTO SeriesType (series_id, class_id) VALUES (9, 28);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (10, 'IMSA Prototype Challenge', 'PC', 'https://cdn.discordapp.com/attachments/813887392171294740/813887779804151858/MPC.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318414012088400/MPC.png', 2);
INSERT INTO SeriesType (series_id, class_id) VALUES (10, 13);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (11, 'NASCAR Cup Series', 'NASCAR', 'https://cdn.discordapp.com/attachments/813887392171294740/813887939280109638/MENCS.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318408823734293/MENCS.png', 2);
INSERT INTO SeriesType (series_id, class_id) VALUES (11, 32);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (12, 'NTT IndyCar Series', 'INDYCAR', 'https://cdn.discordapp.com/attachments/813887392171294740/813887644743630908/INDY.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318404118904862/INDY.png', 2);
INSERT INTO SeriesType (series_id, class_id) VALUES (12, 16);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (13, 'ADAC GT Masters', 'GTM', 'https://cdn.discordapp.com/attachments/813887392171294740/813888347507523604/GTM.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318370119090236/GTM.png', 2);
INSERT INTO SeriesType (series_id, class_id) VALUES (13, 3);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (14, 'Mazda MX-5 Cup', 'MX5', 'https://cdn.discordapp.com/attachments/813887392171294740/813888090477035560/GMX5.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318334878810112/GMX5.png', 2);
INSERT INTO SeriesType (series_id, class_id) VALUES (14, 6);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (15, 'Michelin Pilot Challenge', 'MPC', 'https://cdn.discordapp.com/attachments/813887392171294740/818642252418908200/CTSCC.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318212354146334/CTSCC.png', 2);
INSERT INTO SeriesType (series_id, class_id) VALUES (15, 5);
INSERT INTO SeriesType (series_id, class_id) VALUES (15, 26);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (16, 'Formula 1', 'F1', 'https://cdn.discordapp.com/attachments/813887392171294740/813887619268083722/F1.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318276603019282/F1.png', 2);
INSERT INTO SeriesType (series_id, class_id) VALUES (16, 15);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (17, 'Fanatec GT World Challenge Europe Powered by AWS', 'GTWCE', 'https://cdn.discordapp.com/attachments/813887392171294740/813888479343804426/WCEU.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318597286789130/WCEU.png', 2);
INSERT INTO SeriesType (series_id, class_id) VALUES (17, 3);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (18, 'Intelligent Money British GT Championship', 'BGT', 'https://cdn.discordapp.com/attachments/813887392171294740/813888442966605885/BritGT.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318192703832104/BritGT.png', 2);
INSERT INTO SeriesType (series_id, class_id) VALUES (18, 3);
INSERT INTO SeriesType (series_id, class_id) VALUES (18, 5);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (19, 'FIA World Touring Car Cup', 'WTCC', 'https://cdn.discordapp.com/attachments/813887392171294740/813888563401064458/WTCR.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318615469359114/WTCR.png', 3);
INSERT INTO SeriesType (series_id, class_id) VALUES (19, 25);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (20, 'FIA World Rally Championship', 'WRC', 'https://cdn.discordapp.com/attachments/813887392171294740/813888004661706813/WRC.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318605969260555/WRC.png', 3);
INSERT INTO SeriesType (series_id, class_id) VALUES (20, 36);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (21, 'Autobacs Super GT', 'SGT', 'https://cdn.discordapp.com/attachments/813887392171294740/813888365333708820/SGT.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318541430849566/SGT.png', 3);
INSERT INTO SeriesType (series_id, class_id) VALUES (21, 1);
INSERT INTO SeriesType (series_id, class_id) VALUES (21, 3);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (22, 'Super Formula', 'SF', 'https://cdn.discordapp.com/attachments/813887392171294740/813887649521598505/SF.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318536796405780/SF.png', 3);
INSERT INTO SeriesType (series_id, class_id) VALUES (22, 24);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (23, 'Super Taikyu Series', 'ST', 'https://cdn.discordapp.com/attachments/813887392171294740/813888360565309460/PST.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318504038760468/PST.png', 3);
INSERT INTO SeriesType (series_id, class_id) VALUES (23, 3);
INSERT INTO SeriesType (series_id, class_id) VALUES (23, 5);
INSERT INTO SeriesType (series_id, class_id) VALUES (23, 26);
INSERT INTO SeriesType (series_id, class_id) VALUES (23, 31);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (24, 'NASCAR Xfinity Series', 'NXS', 'https://cdn.discordapp.com/attachments/813887392171294740/818641994527014922/XFIN.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318626521350144/XFIN.png', 3);
INSERT INTO SeriesType (series_id, class_id) VALUES (24, 32);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (25, 'NASCAR Camping World Truck Series', 'CWTS', 'https://cdn.discordapp.com/attachments/813887392171294740/818641662325686312/CWTS.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318218230759434/CWTS.png', 3);
INSERT INTO SeriesType (series_id, class_id) VALUES (25, 32);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (26, 'FIA Formula 2 Championship', 'F2', 'https://cdn.discordapp.com/attachments/813887392171294740/813887623239696384/F2.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318280843067442/F2.png', 3);
INSERT INTO SeriesType (series_id, class_id) VALUES (26, 17);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (27, 'ABB FIA Formula E World Championship', 'FE', 'https://cdn.discordapp.com/attachments/813887392171294740/813887632614490122/FE-01.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318305221279784/FE-01.png', 3);
INSERT INTO SeriesType (series_id, class_id) VALUES (27, 21);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (28, 'Fanatec GT World Challenge America Powered by AWS', 'GTWCA', 'https://cdn.discordapp.com/attachments/813887392171294740/813888473928826890/WCA.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318592690618409/WCA.png', 3);
INSERT INTO SeriesType (series_id, class_id) VALUES (28, 3);
INSERT INTO SeriesType (series_id, class_id) VALUES (28, 5);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (29, 'DTM', 'DTM', 'https://cdn.discordapp.com/attachments/813887392171294740/813888536016322601/DTM.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318222727577600/DTM.png', 3);
INSERT INTO SeriesType (series_id, class_id) VALUES (29, 3);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (30, 'ARCA Menards Series', 'ARCA', 'https://cdn.discordapp.com/attachments/813887392171294740/813887924562690088/ARCA.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318162312036382/ARCA.png', 4);
INSERT INTO SeriesType (series_id, class_id) VALUES (30, 33);
INSERT INTO Series (id, name, shortname, logo, thumbnail, priority) VALUES (31, 'Fanatec GT World Challenge Australia Powered by AWS', 'GTWCAu', 'https://cdn.discordapp.com/attachments/813887392171294740/818641252361699328/AGT.png', 'https://cdn.discordapp.com/attachments/814318055294631996/814318152171126794/AGT.png', 4);
INSERT INTO SeriesType (series_id, class_id) VALUES (31, 3);

# EventSessionType
INSERT INTO EventSessionType (id, name) VALUES (1, 'Race');
INSERT INTO EventSessionType (id, name) VALUES (2, 'Qualifying');
INSERT INTO EventSessionType (id, name) VALUES (3, 'Practice');
INSERT INTO EventSessionType (id, name) VALUES (4, 'Warm-up');
