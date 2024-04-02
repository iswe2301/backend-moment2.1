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

    // Lägger till nya jobberfarenheter till databasen
    client.query(`INSERT INTO workexperience(companyname, jobtitle, location, startdate, enddate, description) VALUES($1, $2, $3, $4, $5, $6);`, [companyname, jobtitle, location, startdate, enddate, description], (err, results) => {
        // Kontrollerar om fel finns
        if (err) {
            // Skriver ut error med felkod
            res.status(500).json({ error: "Något gick fel: " + err });
            return; // Avrbyter
        }

        // Loggar meddelande om fråga har lyckats skapas
        console.log("Fråga skapad!");

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
        res.json({ message: "Jobberfarenhet tillagd", workexperience });

    });
});

// Route för PUT (update), skickar med id för specifik tabellrad som ska uppdateras
app.put("/api/workexperience/:id", (req, res) => {
    // Läser in den skickade datan
    const id = req.params.id;
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
                res.status(404).json({ message: "Jobberfarenhet inte funnen." });
                return;
            } else {
                // Loggar meddelande om fråga har uppdaterats
                console.log("Fråga uppdaterad!");

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
                res.json({ message: "Jobberfarenhet uppdaterad", workexperience });
            }
        }
    );
});

// Startar applikationen/servern
app.listen(port, () => {
    console.log("Server startad på port: " + port);
});
