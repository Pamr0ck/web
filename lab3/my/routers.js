const express = require('express');
const fs = require('fs');
const router = express.Router();
let paintings = require("./media/json/paintings.json");

router.get("/", (req, res) => {
    fs.readFile( "build/html/paintings.html", 'utf8', function (err, data) {res.end(data);});
});

router.get("*", (req, res) => {res.status = 404; res.send("Page not found! Error " + res.status);});

module.exports = router;