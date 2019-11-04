--Tworzymy użytkownika na potrzeby części serwerowej aplikacji
create role polsl with login password 'polsl_gis';

-- dodajemy uprawnienia do sekwencji, które generują klucze główne
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO polsl;

-- dodajemy uprawnienia dla naszego użytkownika
grant all privileges on building to polsl;
grant all privileges on road to polsl;
grant all privileges on poi to polsl;