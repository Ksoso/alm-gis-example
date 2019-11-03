--Dodajemy rozszerzenie PostGIS zawierające typy danych przestrzennych
--oraz funkcje na nich operujące
create extension postgis;

-- tworzymy tabele dla przechowywania geometrii budynków
create table building
(
    id          SERIAL primary key,
    name        varchar(256)            not null,
    description varchar(1024),
    geom        geometry(polygon, 2180) not null
);

comment on column building.id is 'Unikalny identyfikator budynku, automatycznie inkrementowany';
comment on column building.name is 'Nazwa budynku';
comment on column building.description is 'Opis budynku';
comment on column building.geom is 'Wielokąt reprezentujący powierzchnie oraz umieszczenie w przestrzeni budynku';

-- Dodajemy indeks przestrzenny dla kolumny geom
create index building_geom_idx on building using gist (geom);
comment on index building_geom_idx is 'Indeks przestrzenny kolumny geom tabeli building';

-- tworzymy tabele dla przechowywania geometrii dróg
create table road
(
    id          SERIAL primary key,
    name        varchar(256)                           not null,
    description varchar(1024),
    category    text check (category in ('highway', 'ekspresowa', 'glowna', 'zbiorcza', 'lokalna',
                                         'dojazdowa')) not null,
    length      NUMERIC(6, 2) default 0.0,
    geom        geometry(LineString, 2180)             not null
);

comment on column road.id is 'Unikalny identyfikator drogi, automatycznie inkrementowany';
comment on column road.name is 'Nazwa drogi';
comment on column road.description is 'Opis drogi';
comment on column road.category is 'Określa typ drogi';
comment on column road.length is 'Określa dlugość drogi';
comment on column road.geom is 'Linia reprezentująca droge w przestrzeni';

-- Dodajemy indeks przestrzenny dla kolumny geom
create index road_geom_idx on road using gist (geom);
comment on index road_geom_idx is 'Indeks przestrzenny kolumny geom tabeli road';

-- tworzymy tabele dla przechowywania punktów zainteresowania
create table poi
(
    id          SERIAL primary key,
    name        varchar(256)                        not null,
    description varchar(1024),
    category    text check (category in ('hotel', 'zamek', 'pomnik', 'szpital', 'restauracja',
                                         'muzeum')) not null,
    geom        geometry(Point, 2180)               not null
);

comment on column poi.id is 'Unikalny identyfikator punktu zainteresowania, automatycznie inkrementowany';
comment on column poi.name is 'Nazwa punktu zainteresowania';
comment on column poi.description is 'Opis punktu zainteresowania';
comment on column poi.category is 'Określa typ punktu zainteresowania';
comment on column poi.geom is 'Punkt reprezentująca punkt zainteresowania w przestrzeni';

-- Dodajemy indeks przestrzenny dla kolumny geom
create index poi_geom_idx on poi using gist (geom);
comment on index poi_geom_idx is 'Indeks przestrzenny kolumny geom tabeli poi';