<h1>Docker Fullstack esimerkki</h1>

Tässä esimerkissä rakennetaan sovellus, jossa on Express.js REST API + Postgres tietokanta + React sovellus, joita ajetaan Dockerissa. Sekä API, että React sovellus päivittyvät heti kun muutoksia tehdään.

<h2>Asennus</h2>
<ol>
<li>Nimeä .env.example tiedostot .env tiedostoiksi:
<pre>
mv .env.example .env
mv frontend/.env.example frontend/.env
</pre>
</li>
<li>Käynnistä Docker Desktop</li>
<li>Rakenna imaget ja käynnistä kontit: 
<ul>
  <li>
  anna sovelluksen juurikansiossa komento 
<pre>
docker compose up --build --watch
</pre>
<p><b>--watch</b> aktivoi Docker Composen tiedostomuutosten seurannan.
Tässä projektissa <b>docker-compose.override.yml</b>-tiedoston <b>develop.watch</b>-asetus
seuraa paikallista <b>api/src</b>-kansiota. Kun API:n koodia muokataan,
<b>sync+restart</b> kopioi muutokset konttiin ja käynnistää API-kontin uudelleen.
Compose hoitaa uudelleenkäynnistyksen; valitsinta ei välitetä Nodelle.
Frontendin automaattisen päivityksen hoitaa Vite. Tämä asetus vaatii Docker Compose 2.23:n tai uudemman.</p>
  </li>
</ul>
</li>
<li>Avaa selaimeen sivu http://localhost:3001/book jolloin sinun pitäisi nähdä book-taulun data</li>
<li>Avaa selaimeen sivu http://localhost:3000 jolloin sinun pitäisi nähdä React-sovelluksessa tietokannassa olevat kirjat</li>
<li>Kokeile muokata React sovelluksen App.jsx tiedostoa ja tutki päivittyykö web-sivu</li>
</ol>

<h2>Buildaus</h2>
<ol>
<li>Kehityksessä sovellus buildataan komennolla
<pre>
docker compose up --build --watch
</pre>
Jolloin suoritetaan sekä docker-compose.yml, että docker-compose.override.yml
</li>
<li>Ilman kehityksen tiedostoliitoksia sovellus käynnistetään komennolla
<pre>
docker compose -f docker-compose.yml up --build
</pre>
Jolloin suoritetaan vain docker-compose.yml. Frontend käyttää tässäkin Viten kehityspalvelinta; tämä komento ei tee tuotantobuildia.
</li>
</ol>

<p>Frontend käyttää Viteä ja React 19:ää. Docker-kuvat käyttävät Node.js 24:ää.
Paikalliseen frontend-kehitykseen tarvitset Node.js-version 20.19+ tai 22.12+ (suositus: 24).
API käyttää Express 5:tä.</p>
<p>API:n muutokset synkronoidaan konttiin ja palvelin käynnistetään uudelleen Compose Watchilla
(Docker Compose 2.23+). API käynnistyy kontissa komennolla
<b>npm start</b>, ja Compose hoitaa uudelleenkäynnistyksen koodin muuttuessa.</p>
<p>Frontendin API-osoite määritetään tiedostossa <b>frontend/.env</b> muuttujalla
<b>VITE_API_URL</b>.</p>
<p>Tuotantopalvelimella React-sovellus voidaan julkaista Express-API:n kautta.
Aseta ennen buildia frontendin <b>VITE_API_URL</b> tyhjäksi (<b>VITE_API_URL=</b>),
jolloin frontend hakee kirjat saman palvelimen <b>/book</b>-osoitteesta.
Tee tuotantobuild frontend-kansiossa komennolla <b>npm run build</b> ja kopioi syntyvän
<b>dist</b>-kansion sisältö API:n <b>public</b>-kansioon.
Korvaa API:n nykyinen <b>app.get("/", ...)</b>-reitti asetuksella
<b>app.use(express.static("public"));</b> ja käynnistä API <b>api</b>-kansiosta,
jotta suhteellinen public-polku osoittaa oikeaan kansioon.
Express tarjoilee tällöin React-sovelluksen palvelimen juuriosoitteessa ja API toimii edelleen
<b>/book</b>-polussa. Docker-julkaisussa buildin sisältö tulee sisällyttää API:n Docker-kuvan
<b>/usr/src/app/public</b>-kansioon; buildaus ja kopiointi voidaan tehdä monivaiheisella Dockerfilellä.</p>

<h2>Työskentely</h2>
<ul>
  <li>Kun haluat lopettaa kehityksen, anna komento <b>docker compose down</b> ja kun haluat jatkaa kehitystä anna komento <b>docker compose up --build --watch</b></li>
  <li>Jos teet muutoksia Dockerfile tai package.json tiedostoihin, sinun tulee käynnistää kontit uudelleen.</li>
</ul>

<h2>Tietokanta</h2>
<p>
Kaikki .sql ja .sh tiedostot, jotka on mountattu hakemistoon /docker-entrypoint-initdb.d/, ajetaan vain kerran konttia alustettaessa – eli silloin kun Postgres käynnistyy ensimmäistä kertaa ja data-hakemisto (/var/lib/postgresql/data) on tyhjä.

Koska <b>docker-compose.yml</b>-tiedostossa on rivi <b>./book.sql:/docker-entrypoint-initdb.d/book.sql:ro</b>, suoritetaan tiedostossa <b>book.sql</b> olevat koodit:
<pre>
CREATE TABLE book (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  author VARCHAR(255),
  isbn VARCHAR(255)
);

insert into book (name, author, isbn) VALUES('Everything You Ever Wanted to Know','Upton','082305649x');
insert into book (name, author, isbn) VALUES('Photography','Vilppu','205711499');
insert into book (name, author, isbn) VALUES('Drawing Manual Vilppu','Zelanshi','1892053039');
insert into book (name, author, isbn) VALUES('TBA','Zelanshi','0534613932');
insert into book (name, author, isbn) VALUES('Shaping Space','Speight','0534613934');
</pre>
<p>
Jos muokkaat tuota tiedostoa ja haluat, että se suoritetaan uudelleen, sinun on ajettava komento <b>docker compose down -v</b>
</p>
<p>Muodostaaksesi yhteyden kontin Postgres-palvelimeen, suorita komento:
<pre>
docker exec -it postgres_db psql -U netuser -d netdb
</pre>
</p>

<h2>PostgresSQL</h2>

Tässä esimerkissä ei tarvita PostgreSQL serveriä, koska sitä ajetaan Dockerissa. Jos haluat kytheytyä tietokantaan suoraan isäntäkoneelta tarvitset jonkin clientin, kuten <b>psql</b> tai pgAdmin. Jos haluat luoda dump-tiedostoja tarvitset <b>pg_dump</b> sovelluksen. Voit asentaa ne, kun lataat installointi sovelluksen sivulta https://www.postgresql.org/download/windows/ ja asennuksessa valitset asennettavaksi <b>Command Line Tools</b>, voit halutessasi asentaa myös graafisen clientin <b>pgAdmin 4</b>. Lisäksi kannattaa laittaa Windowsin ympäristömuuttujiin polku C:\Program Files\PostgreSQL\17\bin

<h3>Database dump</h3>

Voit luoda tietokannasta dumpin komennolla:
<pre>
pg_dump -U netuser -h 127.0.0.1 -p 5432 netdb> dbdump.sql
</pre>
Huomaa, että sinulla tulee olla asennettuna PostgreSQL, tai ainakin tuo pg_dump

Voit suorittaa edellä luodun dump-tiedoston komennolla:
<pre>
psql -U netuser -h 127.0.0.1 -d netdb -f dbdump.sql
</pre>

<h2>Dockerin kannalta oleelliset tiedostot</h2>
<ul>
<li>docker-compose.yml</li>
<li>docker-compose.override.yml(development tilassa)</li>
<li>.env</li>
<li>postgres.conf (jos halutaan saada paikalliseen PostgreSQL-palvelimeen tuotantopalvelinta vastaavat asetukset)</li>
<li>api/Dockerfile</li>
<li>frontend/Dockerfile</li>
<li>frontend/.env</li>
</ul>

<h2>SSL-yhteys Node.js:n ja PostgreSQL:n välillä</h2>

<p>
Kun Node.js-sovellus yhdistää PostgreSQL-tietokantaan, yhteys voidaan suojata SSL/TLS-salauksella.
Tämä tarkoittaa, että tieto kulkee salattuna palvelimen ja sovelluksen välillä.
</p>

<p>
Yleinen tapa hallita SSL-asetusta eri ympäristöissä on käyttää ympäristömuuttujaa, esimerkiksi:
<b>DB_SSL=true</b> tai <b>DB_SSL=false</b>.
</p>

<p>
Tällöin sama koodi toimii sekä kehityksessä että tuotannossa ilman muutoksia.
</p>

<h2>rejectUnauthorized - mitä se tarkoittaa?</h2>

<p>
Asetus <b>rejectUnauthorized</b> määrittää, tarkistaako Node.js palvelimen SSL-sertifikaatin luotettavuuden.
</p>

<ul>
    <li><b>rejectUnauthorized: true</b> → Node tarkistaa, että palvelimen sertifikaatti on luotettava ja oikein allekirjoitettu</li>
    <li><b>rejectUnauthorized: false</b> → Node ei tarkista sertifikaattia, vaikka yhteys olisi SSL-salattu</li>
</ul>

<p>
Kun arvo on true, yhteys on turvallisempi, koska Node varmistaa että se yhdistää oikeaan palvelimeen eikä väliin ole asettunut hyökkääjä.
</p>

<h2>Esimerkki turvallisesta asetuksesta</h2>

<pre>
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true
  }
});
</pre>

<h2>Mitä PEM / CA-tiedosto tekee?</h2>

<p>
Joissain tapauksissa Node.js ei automaattisesti luota palvelimen sertifikaattiin.
Tällöin tarvitaan CA (Certificate Authority) -tiedosto, yleensä muodossa <b>ca.pem</b>.
</p>

<p>
Tämä tiedosto kertoo Node.js:lle, että tietty sertifikaatti on luotettava.
</p>

<h2>PEM-tiedoston lisääminen koodiin</h2>

<p>
Jos palvelin käyttää omaa tai itse allekirjoitettua sertifikaattia, CA-tiedosto lisätään näin:
</p>

<pre>
const fs = require('fs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    ca: fs.readFileSync('/path/to/ca.pem').toString(),
    rejectUnauthorized: true
  }
});
</pre>

<h2>Milloin PEM-tiedostoa EI tarvita?</h2>

<p>
PEM-tiedostoa ei yleensä tarvita, jos käytät pilvipalvelun (esimerkiksi Render, AWS tai Google Cloud) hallittua PostgreSQL-tietokantaa,
koska ne käyttävät julkisesti luotettuja sertifikaatteja.
</p>

<h2>Yhteenveto</h2>

<ul>
    <li><b>rejectUnauthorized: true</b> → turvallinen ja suositeltu tuotannossa</li>
    <li><b>rejectUnauthorized: false</b> → sallii yhteyden ilman sertifikaatin tarkistusta (vain kehitykseen)</li>
    <li><b>ca.pem</b> → tarvitaan vain, jos Node ei automaattisesti luota palvelimen sertifikaattiin</li>
</ul>


<h2>Deploy Renderiin</h2>
<p>
Render ei osaa lukea docker-compose.yml -tiedostoa ja ajaa kaikkia palveluita yhdellä komennolla. Render tukee kuitenkin Dockerfilea, eli voit ajaa yhden kontin kerrallaan suoraan Dockerfilestä. Joten jaetaan sovellus osiin seuraavasti:
</p>
<ol>
  <li>PostgreSQL-tietokanta</li>
  <li>Backend</li>
  <li>Frontend</li>
</ol>
<p>Aluksi kannattaa luoda Renderiin PostgreSQL tietokanta ja luoda siihen samanlaiset taulut kuin omalla koneella (esim. dump-tiedoston avulla).</p>

<h3>Deploy Docker Hubin kautta</h3>
<h4>Backend</h4>
<ol>
<li>Suorita komennot
<pre>
docker build -t myusername/docker_example-api:latest api/
docker push myusername/docker_example-api:latest
</pre>
</li>
<li>Renderissä:
<ul>
  <li>luo uusi WebService ja valitse Existing image ja kirjoita Image URL (=myusername/docker_example-api)</li>
  <li>Lisää Environment Variablesiin DATABASE URL ja valuen kopioit Renderin Postgressistä (kohdasta Connect)</li>
</ul>
 </li>
</ol>
<h4>Frontend</h4>
<ol>
<li>Luo Renderissä <b>Static Site</b> ja yhdistä projektin Git-repositorio.</li>
<li>Aseta <b>Root Directory</b> arvoksi <b>frontend</b>, build-komennoksi
<b>npm install &amp;&amp; npm run build</b> ja julkaisukansioksi <b>dist</b>.</li>
<li>Lisää buildin Environment Variablesiin <b>VITE_API_URL</b> ja kopioi siihen
backendisi URL (katso ettei loppuun tule kauttaviivaa).</li>
</ol>
<p>Frontendin Dockerfile on kehityspalvelinta varten. Staattinen julkaisu käyttää
Viten tuotantobuildia.</p>
<hr>
<h2>Autentikointi</h2>
<a href="autentikointi.md">autentikointi</a>

<h2>XSS hyökkäys</h2>
<a href="xss.md">xss-hyökkäys</a>
