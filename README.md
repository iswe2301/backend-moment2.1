# DT207G - Backend-baserad webbutveckling, Moment 2 Webbtjänster

Detta repository innehåller koden för en webbtjänst byggd med Node.js och Express. Webbtjänsten är designad för att hantera arbetserfarenheter, som inkluderar information om tidigare anställningar, arbetsroller, och tidsperioder. Grundläggande CRUD (Create, Read, Update, Delete) funktionalitet är implementerad för att interagera med en PostgreSQL-databas.

## Förberedelser

För att köra detta projekt behöver du ha Node.js och npm (Node Package Manager) installerat på din dator. Node.js är miljön som kör serverkoden och npm används för att hantera projektets beroenden.

### Kloning av projekt

Klona projektet med följande kommando:

```bash
git clone https://github.com/iswe2301/backend-moment2.1.git
```

## Projektberoenden

Kör sedan följande kommando för att installera de beroenden som behövs i projeket:

```bash
npm install
```

## Installation & databas-setup

### Skapa databasstruktur

Börja med att skapa en `.env`-fil (lägg i projektets rotmapp) för att ställa in dina databasanslutningsuppgifter. Exempel på innehåll/struktur för `.env`-filen finns att se i `.env.sample`-filen.

Använd installationsskriptet `install.js` för att skapa databasstrukturen. Detta skript skapar automatiskt tabellen `workexperience` i din PostgreSQL-databas. Installationsskriptet kan köras med följande kommando:

```bash
node install.js
```

Du bör se ett meddelande i terminalen som bekräftar att tabellen har skapats.

För att starta servern kan du använda:

```bash
npm run server
```
eller:

```bash
node server.js
```

### Tabellstruktur

Den skapade tabellen `workexperience` har följande struktur:

| Fält         | Datatyp          | Beskrivning                        | Attribut                         |
|--------------|------------------|------------------------------------|----------------------------------|
| id           | serial           | Unikt ID för varje post            | PRIMARY KEY                      |
| companyname  | varchar(255)     | Företagsnamn                       | NOT NULL                         |
| jobtitle     | varchar(255)     | Jobbtitel                          | NOT NULL                         |
| location     | varchar(255)     | Plats                              | NOT NULL                         |
| startdate    | date             | Startdatum                         | NOT NULL                         |
| enddate      | date             | Slutdatum                          |                                  |
| description  | text             | Beskrivning av arbetserfarenheten  | NOT NULL                         |
| created      | timestamp        | Datum för när posten skapades      | DEFAULT CURRENT_TIMESTAMP        |

## Användning

För att använda med webbtjänsten kan du använda följande endpoints:

| Metod   | Ändpunkt                   | Beskrivning                                              |
|---------|----------------------------|----------------------------------------------------------|
| GET     | `/api/workexperience`      | Hämtar alla tillgängliga arbetserfarenheter.             |
| GET     | `/api/workexperience/:id`  | Hämtar en specifik arbetserfarenhet med angivet ID.      |
| POST    | `/api/workexperience`      | Skapar en ny arbetserfarenhet.                           |
| PUT     | `/api/workexperience/:id`  | Uppdaterar en befintlig arbetserfarenhet med angivet ID. |
| DELETE  | `/api/workexperience/:id`  | Raderar en arbetserfarenhet med angivet ID.              |

**OBS!** POST och PUT kräver att du skickar med ett JSON-objekt i förfrågans body. Objektet måste följa strukturen som definieras av databasstrukturen för `workexperience`. Se nedan.

En arbetserfarenhet skickas som JSON med följande struktur:

```json
{
  "companyname": "Exempelföretaget AB",
  "jobtitle": "Webbutvecklare",
  "location": "Sundsvall",
  "startdate": "2020-01-01",
  "enddate": "2022-12-31",
  "description": "Arbetat med utveckling av webbapplikationer i JavaScript, HTML och CSS."
}
```

* **Av:** Isa Westling
* **Kurs:** Backend-baserat webbutveckling (DT207G)
* **Program:** Webbutvecklingsprogrammet
* **År:** 2024
* **Skola:** Mittuniversitetet