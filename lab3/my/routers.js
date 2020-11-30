const express = require('express');
const fs = require('fs');
const router = express.Router();
// let paintings = require("./media/json/paintings.json");
let paintings = require("./build/result/config.json");
let  participants = require("./media/json/participants.json");

function saveConfig() {
    paintings.participants = participants.participants;
    fs.writeFile("build/result/config.json", JSON.stringify(paintings), (err) => {
        if(err) throw err;
    });
}

router.get("/", (req, res) => {
    fs.readFile( "build/html/paintings.html", 'utf8', function (err, data) {res.end(data);});
});

router.get("/participants", (req, res) => {
    fs.readFile( "build/html/participants.html", 'utf8', function (err, data) {res.end(data);});
});

router.get("/auction", (req, res) => {
    fs.readFile( "build/html/auction.html", 'utf8', function (err, data) {res.end(data);});
});


router.get("/paint/:id", (req, res) => {
    let id = req.params.id;
    let value = paintings.paints[parseInt(id)-1];
    res.json(value);
});

router.get("/date", (req, res) => {
    let value = paintings.config;
    res.json(value);
});


router.get("*", (req, res) => {res.status = 404; res.send("Page not found! Error " + res.status);});

router.post("/save", (req, res) => {
    console.log(req.body)
    paintings.config = req.body;
    saveConfig();
    res.json({message: `save config in file`});
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



router.post("/participant", (req, res) => {
    let element = {};
    element.name = req.body.name;
    element.money = req.body.money;
    participants.participants.push(element);
    saveConfig();
    res.json({message: `push partner`});
});

router.delete("/:name", (req, res) => {
    console.log(req)
    let name = req.params.name;
    for(let i = 0; i <  participants.participants.length; i++) {
        if( participants.participants[i].name === name) {
            participants.participants.splice(i, 1);
            saveConfig();
            break;
        }
    }
    res.json({message: `delete partner`});
});

router.put("/:name/:money", (req, res) => {
    for(element of participants.participants) {
        if(element.name === req.params.name) {
            element.money = req.params.money;
            saveConfig();
            break;
        }
    }
    res.json({message: `put money`});
});

module.exports = router;
