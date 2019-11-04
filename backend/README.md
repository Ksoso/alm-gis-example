## Przygotowanie do uruchomienia

W głównym katalogu czyli `{nazwa_aplikacji}/backend/` należy uruchomić z linii poleceń komendę:

### `npm install`

gdzie `nazwa_aplikacji` jest to nazwa folderu głównego, gdzie zostały pobrane źródła z GIT'a. <br />

W celu uruchomienia aplikacji wykonywujemy z linii poleceń:

### `npm start`

## Dostępne skrypty

W katalogu projektu, możesz uruchomić:

### `npm start`

Uruchamia aplikacje pod adresem [http://localhost:3002](http://localhost:3002)

### `npm run start:dev`

Uruchamia aplikacje w trybie deweloperskim pod adresem [http://localhost:3002](http://localhost:3002). Każda zmiana w kodzie
spowoduje przeładowanie aplikacji.

## Konfiguracja połączenia z bazą danych

Konfiguracja połączenia z bazą danych znajduję się w pliku `.env`. <br />
Zawiera następujące parametry: <br />
#### `DB_USER` - nazwa użytkownika
#### `DB_PASSWORD` - hasło
#### `DB_HOST` - adres sieciowy bazy danych (zazwyczaj `localhost`)
#### `DB_PORT` - port, na którym operuje baza danych (domyślnie: `5432`)
#### `DB_DATABASE` - nazwa baza danych, z którym aplikacja ma uzyskać połączenie

