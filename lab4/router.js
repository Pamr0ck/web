const express = require('express');
const fs = require('fs');
const io = require('socket.io').listen(3030);
const router = express.Router();
const config = require("./src/json/config");
const Rollbar = require("rollbar");

const rollbar = new Rollbar('354d994b8ec44d08a755f019332921ea');

rollbar.log("Hello world");

let lastIdArtInAuction;
for(let element of config.paints) {
    if(element.is === "участвует") {
        lastIdArtInAuction = element.id;
    }
}

//дата и время начала аукциона
let begin = `${config.config.beginDate}T${config.config.beginTime}:00`;

//время продажи одной картины
let arrayTimeout = config.config.timeout.split(":");
let timeout = parseInt(arrayTimeout[0])*60*1000 + parseInt(arrayTimeout[1])*1000;

//интервал времени отсчёта до окончания торга по картине
let arrayInterval = config.config.interval.split(":");
let interval = parseInt(arrayInterval[0])*60*1000 + parseInt(arrayInterval[1])*1000;

//пауза перед торгом по картине
let arrayPause = config.config.pause.split(":");
let pause = parseInt(arrayPause[0])*60*1000 + parseInt(arrayPause[1])*1000;

let admin = "";
let lastPartnerPriceUp = "";

io.sockets.on('connection', (socket) => {
    socket.on('hello', (msg) => {
        socket["name"] = msg.name;
        if(msg.name === "ADMIN") admin = socket.id;
        else send("msg", socket, `${msg.name} участвует в аукционе`);
    });

    socket.on('disconnect', (msg) => {
        if(socket["name"] !== "ADMIN") send("msg", socket, `${socket["name"]} покинул аукцион`);
    });

    let startAuction = setInterval(() => {
        if(new Date() - Date.parse(begin) > 0 && new Date() - Date.parse(begin) <= 500) {
            new Promise((resolve, reject) => {
                clearInterval(startAuction);
                socket.json.emit("start", {"message": "Аукцион начался", "time": new Date(), "pause": `${pause}`});
            }).then();
        }
    }, 250);
    socket.on('LetsStart', (msg) => {
        let time = msg.time
        begin =  `${config.config.beginDate}T`;
        begin += time+":00";//${config.config.beginTime}:00`;
    });

    socket.on('endPause', (msg) => {
        new Promise((resolve, reject) => {
            send("market", socket, "Торг по картине начался", false);
            setTimeout(() => {
                if(socket.id === lastPartnerPriceUp) {
                    io.sockets.sockets[lastPartnerPriceUp].json.emit("win", {"message": `Картина куплена`});
                    lastPartnerPriceUp = "";
                }
                send("endMarket", socket, "Торг по картине закончился", false);
            }, timeout);
            resolve("good");
        }).then();
    });

    socket.on('endAuction', (msg) => {
        send("END", socket, "Аукцион закончился", false);
        if(admin !== "") io.sockets.sockets[admin].json.emit("END", {"message": `Аукцион закончился`,
            "time": new Date()});
    });

    socket.on('newPrice', (msg) => {
        lastPartnerPriceUp = socket.id;
        socket.json.emit("price", {"message": `${msg.name} повысил цену`, "up": msg.up, "time": new Date()});
        socket.broadcast.json.emit("price", {"message": `${msg.name} повысил цену`, "up": msg.up, "time": new Date()});
    });

    socket.on('toAdmin', (msg) => {
        if(admin !== "") io.sockets.sockets[admin].json.emit("buy", {"message": `${msg.name} купил картину`,
            "time": new Date(), "name": msg.name, "money": msg.money, "art": msg.art});
    });
});

function send(type, socket, msg, otherSockets = true) {
    socket.json.emit(type, {"message": msg, "time": new Date()});
    if(otherSockets) socket.broadcast.json.emit(type, {"message": msg, "time": new Date()});
}

router.get("/", (req, res) => { res.render("enter");});

router.get("/logon/:name", (req, res) => {
    for(let element of config.partners) {
        if(element.name === req.params.name) {
            res.render("user", {name: req.params.name, money: element.money, count: lastIdArtInAuction});
            return;
        }
    }
    if(req.params.name === "ADMIN") res.render("admin", {partners: config.partners, arts: config.paints});
    else res.send("Участник с таким именем не найден!");
});

router.get("/next/art/:lastID", (req, res) => {
    let index = parseInt(req.params.lastID);
    while(index < config.paints.length) {
        if(config.paints[index].is == "участвует") {
            res.json(config.paints[index]);
            return;
        }
        index++;
    }
    rollbar.log("Ошибка на сервере: выход за пределы массива картин");
});

function test(x, y) {
    return parseInt(x) > parseInt(y);
}

module.exports = {
    router: router,
    test: test,
    lastIdArtInAuction: lastIdArtInAuction,
    timeout: timeout,
    interval: interval,
    pause: pause,
    config: config
};
