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

// Startar applikationen/servern
app.listen(port, () => {
    console.log("Server startad på port: " + port);
});
