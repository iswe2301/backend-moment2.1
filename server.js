// Inkluderar express
const express = require("express");
const app = express(); // Startar applikationen med express

// Lagrar variabel för port, startar antingen enlgit inställningar i env-filen eller på port 3000
const port = process.env.DB_PORT || 3000;

// Startar applikationen/servern
app.listen(port, () => {
    console.log("Server startad på port: " + port);
});
