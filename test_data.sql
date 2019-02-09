CREATE TABLE serie(

	id SERIAL PRIMARY KEY,

	name TEXT,

	website TEXT

);



CREATE TABLE track(

	id SERIAL PRIMARY KEY,

	name TEXT,

	country TEXT

);



CREATE TABLE event(

	id SERIAL PRIMARY KEY,

	name TEXT,

	date_start DATE,

	date_end DATE,

	serie INT REFERENCES serie(id),

	track INT REFERENCES track(id),

	tns BOOLEAN

);



INSERT INTO "public"."serie" ("name", "website") VALUES('imsa prototype challenge', 'https://prototypechallenge.imsa.com');

INSERT INTO "public"."serie" ("name", "website") VALUES('imsa michelin pilot challenge', 'https://michelinpilotchallenge.imsa.com');

INSERT INTO "public"."serie" ("name", "website") VALUES('24h prototype series', 'https://www.24hseries.com');

INSERT INTO "public"."serie" ("name", "website") VALUES('tcr middle east', 'http://middleeast.tcr-series.com');

INSERT INTO "public"."serie" ("name", "website") VALUES('asian le mans series', 'http://www.asianlemansseries.com');

INSERT INTO "public"."serie" ("name", "website") VALUES('nascar mencs', 'https://www.nascar.com/monster-energy-nascar-cup-series/2018/schedule/');

INSERT INTO "public"."serie" ("name", "website") VALUES('blancpain gt world challenge america', 'https://world-challenge.com/competition-classes/sro-motorsports-america-2019-championships/?tab=blancpain-gt-world-challenge-america');

INSERT INTO "public"."serie" ("name", "website") VALUES('imsa weathertech sportscar championship', 'https://sportscarchampionship.imsa.com');

INSERT INTO "public"."serie" ("name", "website") VALUES('intercontinental gt challenge', 'https://www.bathurst12hour.com.au');



INSERT INTO "public"."track" ("name", "country") VALUES('daytona international speedway', 'usa');

INSERT INTO "public"."track" ("name", "country") VALUES('dubai autodrome', 'uae');

INSERT INTO "public"."track" ("name", "country") VALUES('mount panorama', 'australia');

INSERT INTO "public"."track" ("name", "country") VALUES('yas marina', 'uae');

INSERT INTO "public"."track" ("name", "country") VALUES('sepang international circuit', 'malaysia');

INSERT INTO "public"."track" ("name", "country") VALUES('atlanta motor speedway', 'usa');

INSERT INTO "public"."track" ("name", "country") VALUES('circuit of the americas', 'usa');



INSERT INTO "public"."event" ("name", "date_start", "date_end", "serie", "track", "tns") VALUES ('3 hours of daytona', '2019-01-04', '2019-01-06', 1, 1, false);

INSERT INTO "public"."event" ("name", "date_start", "date_end", "serie", "track", "tns") VALUES ('rolex 24 hours', '2019-01-25', '2019-01-27', 9, 1, true);

INSERT INTO "public"."event" ("name", "date_start", "date_end", "serie", "track", "tns") VALUES ('6 hours of dubai', '2019-01-04', '2019-01-06', 2, 3, false);

INSERT INTO "public"."event" ("name", "date_start", "date_end", "serie", "track", "tns") VALUES ('liqui-moly bathurst 12 hours', '2019-01-01', '2019-01-03', 4, 3, false);

INSERT INTO "public"."event" ("name", "date_start", "date_end", "serie", "track", "tns") VALUES ('tcr middle east', '2019-02-01', '2019-02-03', 5, 4, false);

INSERT INTO "public"."event" ("name", "date_start", "date_end", "serie", "track", "tns") VALUES ('4 hours of sepang', '2019-02-22', '2019-02-24', 6, 5, false);

INSERT INTO "public"."event" ("name", "date_start", "date_end", "serie", "track", "tns") VALUES ('folds of honor quiktrip 500', '2019-02-22', '2019-02-24', 7, 6, false);

INSERT INTO "public"."event" ("name", "date_start", "date_end", "serie", "track", "tns") VALUES ('blancpain gt world challenge america', '2019-03-01', '2019-03-03', 8, 7, false);


