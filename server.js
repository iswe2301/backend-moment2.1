// Inkluderar postgre
const { Client } = require("pg");

// Inkluderar .env-filen med anslutningsinställningar
require("dotenv").config();

// Inkluderar express
const express = require("express");
const app = express(); // Startar applikationen med express

// Inkluderar och använder cors
const cors = require("cors");
app.use(cors());

app.use(express.json()); // Inkluderar middleware till express för att konvertera data till json automatiskt

// Lagrar variabel för port, startar antingen enlgit inställningar i env-filen eller på port 3000
const port = process.env.DB_PORT || 3000;

// Ansluter till databasen
const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
        rejectUnauthorized: false,
    }
});

// Kontrollerar errors vid anslutning
client.connect((error) => {
    if (error) {
        console.error("Anslutning misslyckades: " + error); // Skriver ut felmeddelande och avbryter funktionen
        return;
    }
    console.log("Ansluten till databasen!") // Skriver ut success-meddelande vid lyckad anslutning
});

// Skapar routes

// Route för GET
app.get("/api/workexperience", (req, res) => {
    // Hämtar alla alla jobberfarenheter från DB
    client.query(`SELECT * FROM workexperience;`, (err, results) => {
        // Kontrollerar om fel finns
        if (err) {
            // Skriver ut error med felkod
            res.status(500).json({ error: "Något gick fel: " + err });
            return;
        }
        // Kontrollerar om det inte finns resultat
        if (results.rows.length === 0) {
            // Skriver ut felmeddelande med felkod om inga resultat finns
            res.status(404).json({ message: "Inga jobberfarenheter funna" });
        } else {
            // Annars skickas resultatet
            res.json(results.rows);
        }
    });
});

// Route för POST
app.post("/api/workexperience", (req, res) => {
    // Läser in den skickade datan
    let companyname = req.body.companyname;
    let jobtitle = req.body.jobtitle;
    let location = req.body.location;
    let startdate = req.body.startdate;
    let enddate = req.body.enddate;
    let description = req.body.description;

    // Kontrollerar om slutdatum är tom textsträng, sätter till NULL
    if (enddate === "") {
        enddate = null;
    }

    // Skapar felhantering
    let errors = {
        message: "",
        details: "",
        https_response: {

        }
    };

    // Kontrollerar om företagsnamn, jobbtitel, plats startdatum eller beskrivning saknas
    if (!companyname || !jobtitle || !location || !startdate || !description) {
        // Skriver ut error-meddelanden isåfall
        errors.message = "Företagsnamn, jobbtitel, plats, startdatum och beskrivning ej inkluderat";
        errors.details = "Du måste inkludera företagsnamn, jobbtitel, plats, startdatum samt beskrivning JSON";

        // Skriver ut error-felkod
        errors.https_response.message = "Bad request";
        errors.https_response.code = 400;
        res.status(400).json(errors);
        return; // Avbryter funktionen
    }

    // Lägger till nya jobberfarenheter till databasen, returnerar skapat ID
    client.query(`INSERT INTO workexperience(companyname, jobtitle, location, startdate, enddate, description) VALUES($1, $2, $3, $4, $5, $6) RETURNING id;`, [companyname, jobtitle, location, startdate, enddate, description], (err, results) => {
        // Kontrollerar om fel finns
        if (err) {
            // Skriver ut error med felkod
            res.status(500).json({ error: "Något gick fel: " + err });
            return; // Avrbyter
        }

        // Hämtar ID från resultatet och lagrar i variabel
        let id = results.rows[0].id;

        // Loggar meddelande om fråga har lyckats skapas
        console.log(`Jobberfarenhet med id "${id}" tillagd!`);

        // Skapar ett objekt som representerar jobberfarenheten
        let workexperience = {
            companyname: companyname,
            jobtitle: jobtitle,
            location: location,
            startdate: startdate,
            enddate: enddate,
            description: description
        }

        // Skickar ett svar med meddelande om lyckad tilläggning och detaljerna om den tillagda jobberfarenheten
        res.json({ message: `Jobberfarenhet med id "${id}" tillagd.`, workexperience });

    });
});

// Route för PUT (update), skickar med id för specifik tabellrad som ska uppdateras
app.put("/api/workexperience/:id", (req, res) => {
    // Läser in den skickade datan
    let id = req.params.id;
    let companyname = req.body.companyname;
    let jobtitle = req.body.jobtitle;
    let location = req.body.location;
    let startdate = req.body.startdate;
    let enddate = req.body.enddate;
    let description = req.body.description;

    // Kontrollerar om slutdatum är tom textsträng, sätter till NULL
    if (enddate === "") {
        enddate = null;
    }

    // Skapar felhantering
    let errors = {
        message: "",
        details: "",
        https_response: {

        }
    };

    // Kontrollerar om företagsnamn, jobbtitel, plats startdatum eller beskrivning saknas
    if (!companyname || !jobtitle || !location || !startdate || !description) {
        // Skriver ut error-meddelanden isåfall
        errors.message = "Företagsnamn, jobbtitel, plats, startdatum och beskrivning ej inkluderat";
        errors.details = "Du måste inkludera företagsnamn, jobbtitel, plats, startdatum samt beskrivning JSON";

        // Skriver ut error-felkod
        errors.https_response.message = "Bad request";
        errors.https_response.code = 400;
        res.status(400).json(errors);
        return; // Avbryter funktionen
    }

    // Uppdaterar tabellen workexperience på specifik rad som stämmer överrens med ID, sätter in de nya värdena
    client.query(
        `UPDATE workexperience SET companyname=$1, jobtitle=$2, location=$3, startdate=$4, enddate=$5, description=$6 WHERE id=$7;`, [companyname, jobtitle, location, startdate, enddate, description, id], (err, result) => {
            // Kontrollerar om fel finns
            if (err) {
                // Skriver ut felmeddelande med felkod isåfall och avbryter funktionen
                res.status(500).json({ error: "Något gick fel vid uppdatering: " + err });
                return;
            }
            // Kontrollerar om antalet påverkade rader är 0 (inget resultat stämmer med id)
            if (result.rowCount === 0) {
                // Skriver ut felmeddelande isåfall och avbryter
                res.status(404).json({ message: `Ingen jobberfarenhet med id "${id}" kunde hittas.` });
                return;
            } else {
                // Loggar meddelande om fråga har uppdaterats
                console.log(`Jobberfarenhet med id "${id}" har uppdaterats!`);

                // Skapar ett objekt som representerar jobberfarenheten
                let workexperience = {
                    companyname: companyname,
                    jobtitle: jobtitle,
                    location: location,
                    startdate: startdate,
                    enddate: enddate,
                    description: description
                }

                // Skickar ett svar med meddelande om lyckad tilläggning och detaljerna om den tillagda jobberfarenheten
                res.json({ message: `Jobberfarenhet med id "${id}" har uppdaterats.`, workexperience });
            }
        }
    );
});

// Route för delete, skickar med id för specifik tabellrad som ska tas bort
app.delete("/api/workexperience/:id", (req, res) => {
    // Läser in id från den skickade datan
    let id = req.params.id;

    // Raderar specifik rad som stämmer överrens md ID från tabellen workexperience
    client.query(`DELETE FROM workexperience WHERE id=$1`, [id], (err, result) => {
        // Kontrollerar om fel finns
        if (err) {
            // Skriver ut felmeddelande och felkod, avrbyter körning av koden
            res.status(500).json({ error: "Något gick fel vid borttagning: " + err });
            return;
        }
        // Kontrollerar om antalet påverkade rader är 0 (inget resultat stämmer med id)
        if (result.rowCount === 0) {
            // Skriver ut felmeddelande och felkod, avbryter körning av koden
            res.status(404).json({ message: `Ingen jobberfarenhet med id "${id}" kunde hittas.` });
            return;
        } else {
            // Loggar meddelande om radering har lyckats tillsammans med berört id
            console.log(`Jobberfarenhet med id "${id}" har raderats!`);
            // Skickar ett svar att radering har lyckats tillsammans med berört id
            res.json({ message: `Jobberfarehet med id "${id}" har raderats.` });
        }
    });
});

// Startar applikationen/servern
app.listen(port, () => {
    console.log("Server startad på port: " + port);
});
