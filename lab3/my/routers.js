const express = require('express');
const fs = require('fs');
const router = express.Router();
let paintings = require("./media/json/paintings.json");

router.get("/", (req, res) => {
    fs.readFile( "build/html/paintings.html", 'utf8', function (err, data) {res.end(data);});
});

router.get("/participants", (req, res) => {
    fs.readFile( "build/html/participants.html", 'utf8', function (err, data) {res.end(data);});
});


router.get("/paint/:id", (req, res) => {
    let id = req.params.id;
    let value = paintings.paints[parseInt(id)-1];
    res.json(value);
});

router.post("/", (req, res) => {
    let currentElement = parseInt(req.body.id)-1;
    paintings.paints[currentElement].artist = req.body.artist;
    paintings.paints[currentElement].name = req.body.name;
    paintings.paints[currentElement].des = req.body.des;
    paintings.paints[currentElement].is = req.body.is;
    paintings.paints[currentElement].price = req.body.price;
    paintings.paints[currentElement].minStep = req.body.minStep;
    paintings.paints[currentElement].maxStep = req.body.maxStep;
    saveConfig();
    res.json("1");
});

function saveConfig() {
    // paintings.partners = partners.partners;
    fs.writeFile("build/result/config.json", JSON.stringify(paintings), (err) => {
        if(err) throw err;
    });
}


router.get("*", (req, res) => {res.status = 404; res.send("Page not found! Error " + res.status);});

module.exports = router;