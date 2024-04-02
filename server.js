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

// Startar applikationen/servern
app.listen(port, () => {
    console.log("Server startad på port: " + port);
});
