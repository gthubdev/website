INSERT INTO Usertype (id, name) VALUES (1, 'Admin');
INSERT INTO Usertype (id, name) VALUES (2, 'TV Crew');

# Password is 'admin'
INSERT INTO User (username, password, name, usertype) VALUES ('admin', '$2a$08$PpEU2iK0atLmAkcKjXPXD.byYaw3Fxzlen3VUxB8l70U.IQkb/yZ.', 'Admin', 1);
