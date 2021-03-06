## Instalacja PostgreSQL i PostGIS

Pierwszym krokiem do uruchomienia relacyjnej bazy danych PostgreSQL z dodatkiem dla danych przestrzennych PostGIS jest
udanie się pod [ten link](https://www.postgresql.org/download/). Należy pobrać najnowszą wersję pod nasz system
operacyjny. 

Bazę danych należy zainstalować z domyślnymi ustawieniami. Ważne jest to, aby zapamiętać jakie hasło ustawiło się dla 
konta administracyjnego `postgres` podczas procesu instalacji, ponieważ nie ma opcji przypomnienia hasła i nie będzie
możliwość połączenia się z bazą danych.

Po zakończeniu instalacji, powinno się pojawić okienko dialogowe z pytaniem `Czy aplikacja powinna akeceptować zapytania
przychodzące z sieci`, oczywiście się zgadzamy. Warto również zaznaczyć, aby po instalacji został uruchomiony `StackBuilder`.
Jeśli przeoczymy ten etap to nic stracone, wystarczy uruchomić aplikację `StackBuilder`, która została zainstalowana z naszą 
instancją PostgreSQL.

![StackBuilder](docs/stackbuilder.PNG)

Aplikacja `StackBuilder` posłóży do rozszerzenia PostgreSQL o dodatek PostGIS. Klikamy dalej, uprzednio wybierając zainstalowaną bazę danych,

![StackBuilder selekcja bazy danych](docs/stackbuilder_db_selection.PNG)
 
aż dojdziemy do okna z woborem aplikacji do zainstalowania, pod zakładką `Spatial Extensions` znajduję się `PostGIS`, zazanaczamy i kontynujemy instalację
z domyślnymi parametrami.

![StackBuilder spatial](docs/stackbuilder_spatial.PNG)

### Import schematu do bazy danych

Uruchamiamy aplikacje `pgAdmin4`, która została zainstalowana z PostgreSQL (zostanie ona uruchomiona w przeglądarce internetowej).
Po lewej stronie znajdziemy drzewo o nazwie `Servers`, po jego rozwinięciu nasza lokalna baza powinna być dostępna pod nazwą `PostgreSQL 12`.
Klikamy na nią prawym przyciskiem myszy i wybieramy `Connect Server` lub klikamy dwukrotnie prawy przycisk myszy w celu połączenia z bazą danych.
Zostaniemy poproszeni o hasło dla użytkownika `postgres`, jakie podaliśmy podczas instalacji. Warto zaznaczyć, aby aplikacja zapamiętała nasza hasło.

![create_db_1](docs/db_import_1.png)

#### Tworzenie bazy danych

Wybieramy kolejno `Databases` => `Create` => `Database...`
 
 ![create_db_2](docs/db_import_2.png)
 
Uzupełniamy pole `Database` w oknie dialogowym i klikamy `Save`.

 ![create_db_3](docs/db_import_3.png)

#### Uruchamianie niezbędnych skryptów SQL

 ![create_db_4](docs/db_import_4.png)

Rozwijamy drzewo `Databases` i klikamy w bazę danych utworzoną w poprzednim kroku. Z górnego menu paska narzędzi wybieramy 
`Object (1)` => `CREATE Script (2)`. Do edytora SQL (3) wklejamy zawartość pliku `sql/init.sql` i klikamy przycisk `Execute/Refresh (F5) (4)`.

Po uruchomieniu skryptu powinniśmy otrzymać notyfikację, że operacja zakończyła się sukcesem. W celu upewnienia się, że wszystko
jest jak należy. Klikamy prawym przyciskiem na naszej bazie danych i wybieramy `Refresh`. Rozwijamy drzewo jak na poniższym zrzucie ekranu:

 ![create_db_4](docs/db_import_5.png)

##### Nowy użytkownik
 
Dodatkowo jeśli zależy nam, aby nasza aplikacja nie łączyła się z bazą danych na koncie administratorskim, należy w taki sam sposób
uruchomić skrypt `sql/user.sql`, który doda nowego użytkownika do bazy danych o nazwie `polsl` i haśle `posl-gis`. 

## Geoserver
Najpierw upewniamy się, że mamy zainstalowane środowisko uruchomieniowe języka Java (JRE lub JDK), możemy je pobrać np: z 
[Oracle JDK](https://www.oracle.com/technetwork/java/javase/downloads/index.html). Geoserver działa poprawnie począwszy od Java 8 przez 11. 
Na wersji 13 nie zostały przeprowadzony wystarczające testy. Jeśli JDK lub JRE od firmy Oracle z jakiś przyczyn nie może być zainstalowane, Geoserver działa
adekwatnie na OpenJDK, które można zdobyć np: [tutaj](https://adoptopenjdk.net/).

### Zmienna środowiskowa JAVA_HOME

Po zainstalowaniu JDK/JRE ważne jest, aby ustawić zmienną środowiskową `JAVA_HOME`:
1. Przchodzimy do `Panel Sterowania` -> `System` -> `Zaawansowane ustawienia systemu` -> `Zmienne środowiskowe`
2. Pod `Zmienne systemowe` klikamy  `Nowa...`
3. Dla `Nazwa zmiennej` wpisujemy `JAVA_HOME`. Dla `Wartość zmiennej` wpisujemy ścieżkę do głównego folderu JDK/JRE np:
`C:\Program Files\Java\jdk1.8.0_40`.
4. Klikamy `Ok` dokładnie trzy razy.

### Uruchamianie Geoservera

Geoserver jest narzędziem w języku Java, które służy do udostępnienia niemalże wszystkich ogólnodostępnych formatów zdolnych 
do przechowywania danych przestrzennym. Ze [strony](http://geoserver.org/release/stable/) pobieramy `Platform independent Binary` 
i wypakowujemy zawartość. Otwieramy wypakowany folder i następnie whodzimy do folderu `bin`. Zależnie od systemu operacyjnego uruchamiamy 
`startup.bat` (Windows) lub `startup.sh` (Unix) i czekamy aż się uruchomi. Zamykamy adekwatnie przez uruchomienie `shutdown.bat`
lub `shutdown.sh`.  

Jeśli inicjalizacja aplikacji Geoserver zakończy się sukcesem to w dowolnej przeglądarce internetowej wchodzimy w 
[http://localhost:8080/geoserver](http://localhost:8080/geoserver) i logujemy się domyślnym użytkownikiem `admin` i hasłem `geoserver`.

### Usuwanie danych demonstracyjnych

Geoserver posiada od razu skonfigurowane dane oraz serwisy demonstracyjne. W celu ich usunięcia należy usunąć zawartość
następujących katalogów:<br />
1. `data_dir/workspaces/`
2. `data_dir/layerGroups/`
3. `data_dir/data/`

**Powyższą czynność najlepiej wykonać przed pierwszym uruchomieniem, aby nie usunąć własnych ustawień**

## Instalacja PostgreSQL i PostGIS Docker

Pobieramy obraz PostgreSQL z PostGIS <br />

`docker pull kartoza/postgis` (domyślny użytkownik: `docker` z hasłem `docker`)

Pobieramy obraz Geoserver <br />

`docker pull kartoza/geoserver` (domyślny użytkownik: `admin` z hasłem `geoserver`)

Uruchamiamy bazę danych i geoserver <br />

`docker run --name "postgis" -d -t kartoza/postgis` <br />
`docker run --name "geoserver" --link postgis:postgis -p 8080:8080 -d -t kartoza/geoserver`

Dodatkowe informacje znajdują się w dokumentacji obrazu [Geoserver](https://hub.docker.com/r/kartoza/geoserver/) oraz 
[PostGIS](https://hub.docker.com/r/kartoza/postgis)

## Praca z Geoserverem

Po uruchomienie Geoservera udajemy się pod [http://localhost:8080/geoserver](http://localhost:8080/geoserver), gdzie znajduję się
panel administracyjny. Logujemy się standardowo na użytkownika `admin` o haśle `geoserver`.

### Przestrzeń robocza

Pracę z Geoserverem warto zacząć od stworzenia przestrzeni roboczej (Workspace), do której będziemy przypisywać wszystkie 
przez nas wystawiane operacje.

![tworzenie workspace etap 1](docs/workspace_1.png)

1. Wybieramy `Worskpaces` z menu.
2. Następnie używamy przycisku `Add new workspace`.

   ![tworzenie workspace dane](docs/workspace_2.png)

3. Wpisujemy dowolną odpowiadającą nam nazwę w pole `Name`.
4. W pole `Namespace URI` wpisujemy dowolny adres, który może zostać skojarzony z naszym zasobem. 
Nie musi to być istniejący adres.
5. Opcjonalnie można zaznaczyć opcje `Default Workspace`, aby nasz obszar roboczy stał się domyślny.
6. Zatwierdzamy klikając w przycisk `Wyślij`.
7. Jeśli się uda, otrzymamy taki wynik:

    ![tworzenie workspace tabela](docs/workspace_3.png)

### Połączenie Geoservera z bazą danych PostGIS

W celu połączenie bazy danych PostgreSQL z rozszerzeniem PostGIS z Geoserverem, należy dodać tzw. przechowalnie (store).

![db dane](docs/store_1.png)

1. Wybieramy `Stores` z menu.
2. Następnie używamy przycisku `Add new Store`.
3. Wybieramy opcję PostGIS NG.

   ![db typ](docs/store_2.png)

4. Ustawiamy informacje o źrodle danych, należy pamiętać, aby wybrać uprzednio utworzony obszar roboczy:

   ![db opis](docs/store_3.png)

5. Ustawiamy połączenie do utworzonej wcześniej bazy danych:

   ![db polaczenie](docs/store_4.png)

6. Pozostałe ustawienia pozostawiamy na wartościach domyślnych.
7. Zatwierdzamy przez przycisk `Save`.
8. Jeśli wszystko zakończy się powodzeniem otrzymamy taki widok, gdzie `LayerName` jest równoznaczny z nazwą tabeli.

   ![db layerrs](docs/store_5.png)

### Publikacja zasobów

#### Style SLD

Publikacje zasobów rozpoczniemy od zdefiniowania wyglądu wizualnego danych z tabeli `building` jak i `road` przez 
użycie plików [Styled Layer Descriptor (SLD)](https://docs.geoserver.org/stable/en/user/styling/sld/reference/index.html#sld-reference).
Plik SLD, jest plikiem XML, a przykładowe jego definicje dla różnych typów geometrii można znaleźć [tutaj](https://docs.geoserver.org/stable/en/user/styling/sld/cookbook/index.html)  

![db publikacja](docs/style_1.png)

1. Wybieramy `Style` z menu.
2. Następnie używamy przycisku `Dodaj nowy styl`.
3. Wpisujemy `Nazwa` **building** i wybieramy wcześniej utworzony obszar roboczy.
4. Klikamy `Wybierz plik` pod `Upload a style file` i wgrywamy plik `sld/building.sld`.
5. Klikamy `załaduj`, jeśli zobaczymy zawartość w edytorze tekstu to używamy przycisku `Wyślij`.

    ![db publikacja](docs/style_2.png)
    
6. Powyższe czynności powtarzamy dla pliku `sld/road.sld` i ustawiamy wartość `Nazwa` jako **road**.    

#### Publikacja zawartości bazy danych

W celu publikacji zawartości bazy danych należy wystawić warstwę:

![db publikacja](docs/layers_1.png)

1. Wybieramy `Warstwy` z menu.
2. Następnie używamy przycisku `Dodaj nowy zasób`.
3. Z listy rozwijanej wybieramy uprzednio utworzoną przechowalanie (store).
4. Klikamy w `Publish` przy wybranej przez nas nazwie tabeli.

    ![db publikacja_data_store](docs/layers_2.png)
    
5. Formularz `Edit Layer` zawiera podstawowe informacje o naszym publikowanyn zasobie. Uzupełniamy tak jak na przykładzie, najważniejsze 
jest pole `Nazwa`, ponieważ będziemy ją później traktować jako identyfikator. Pola `Tytuł` oraz `Abstract` są dowolne:

    ![db publikacja_edit_layer](docs/layers_3.png)

6. Przechodzimy do forumularza `Granice` i klikamy kolejno `Obliczyć na podstawie danych`, jeśli tabela posiada dane i są one 
 niezmienne lub `Compute from SRS bounds`, jeśli dane w tabeli ulegną przyrostowi w czasie. Następnie klikamy w `Oblicz na podstawie natywnych granic`:
    
    ![db publikacja_granice](docs/layers_4.png) 
    
7. Wracamy na górę strony i klikamy w zakładkę `Publishing` i przewijamy do formularza `WMS Settings` i wybieramy`polsl:building`
jako wybrany styl, ponieważ nasza tabela zawiera wielokąty.

    ![db publikacja_granice](docs/layers_5.png)

8. Zatwierdzamy przez przycisk `Save`:

    ![db publikacja_granice](docs/layers_6.png) 

9. Powyższe kroki powtarzamy dla zasobu tabeli `road`. Zmieniami tylko zawartość pola `Nazwa` na `road` oraz w zakładce `Publishing` 
w formularzy `WMS Settings` wybieramy opcję `polsl:road`.

### Podgląd warstwy

W celu podglądu warstwy i przy okazji weryfikacji czy dane są poprawnie wyświetlane, należy podjąć następujące kroki:
1. Wybrać z menu `Podgląd warstw`.
2. Znaleźć w tabeli interesującą nas warstwę i kliknąć przycisk `OpenLayers` w kolumnie `Typowe formaty`.

## Aplikacja kliencka oraz serwerowa

Cześć kliencka (aplikacja webowa) oraz serwerowa wymagają do uruchomienia `node.js`, które należy pobrać i zainstalować
ze strony [https://nodejs.org/en/](https://nodejs.org/en/). Wybieramy wersję z dopiskiem LTS i instalujemy z domyślnymi
ustawieniami.

Szczegóły uruchamiania aplikacji klienckiej znajdują się w pliku `client/README.md`. <br />
Szczegóły uruchamiania aplikacji serwerowej znajdują się w pliku `backend/README.md`.