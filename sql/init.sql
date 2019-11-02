--Tworzymy użytkownika na potrzeby części serwerowej aplikacji 
create role polsl with login password 'polsl_gis';
alter role polsl CREATEDB;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO polsl;

--Tworzymy bazę danych
create database polsl;
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

-- dodajemy uprawnienia dla naszego użytkownika
grant all privileges on building to polsl;

-- tworzymy tabele dla przechowywania geometrii dróg
create table road
(
    id          SERIAL primary key,
    name        varchar(256)                                                                                        not null,
    description varchar(1024),
    category    text check (category in ('autostrada', 'ekspresowa', 'główna', 'zbiorcza', 'lokalna',
                                         'dojazdowa'))                                                              not null,
    length      NUMERIC(6, 2) default 0.0,
    geom        geometry(LineString, 2180)                                                                          not null
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

-- dodajemy uprawnienia dla naszego użytkownika
grant all privileges on road to polsl;


