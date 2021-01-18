const debug = require("debug")("sockets");
const brokerManager = require("./BrokerManager");
const stockManager = require("./StockManager");
let brokers = brokerManager.data;
let stocks = stockManager.data;
let interval = null;
let trading = false;

module.exports = function (app) {
    const io = require("socket.io")(app, {
        cors: {
            origins: "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true,
        }
    });
    io.sockets.on("connection", (socket) => {
        socket.on("connected", (msg) => {
            debug("Connect");
            debug(msg);
            socket.name = msg.name;
        });
        socket.on("start", () => {
            if (trading) return;
            debug("Started");
            trading = true;
            socket.emit("update", {
                stocks: stocks,
                brokers: brokers,
                trading: trading,
            });
            socket.emit("reset", {});
            interval = setInterval(update, 5000);
        });
        socket.on("finish", () => {
            if (!trading) return;
            debug("Finished");
            trading = false;
            clearInterval(interval);
            io.emit("update", {
                stocks: stocks,
                brokers: brokers,
                trading: false,
            });
        });
        socket.on("dumpStocks", (msg) => {
            console.log(1);
            if (stocks !== msg.stocks) {
                stocks = msg.stocks
                stockManager.changeData(stocks);
                io.emit("update", {
                    stocks: stocks,
                    brokers: brokers,
                    trading: trading,
                });
            }
        });
        socket.on("buy", (msg) => {
            if (trading) {
                debug("Buying");
                debug(msg);
                // console.log(1);
                buyHandler(msg);
                socket.emit("update", {
                    stocks: stocks,
                    brokers: brokers,
                    trading: trading,
                });
            }
        });
        socket.on("sell", (msg) => {
            if (trading) {
                debug("Selling");
                debug(msg);
                // console.log(2);
                sellHandler(msg);
                socket.emit("update", {
                    stocks: stocks,
                    brokers: brokers,
                    trading: trading,
                });
            }
        });
    });

    function update(socket) {
        updateStocksPrice();
        brokerManager.changeData(brokers);
        stockManager.changeData(stocks);
        io.emit("update", {
            stocks: stocks,
            brokers: brokers,
            trading: trading,
        });
    }
};

function buyHandler(msg) {
    let user = msg.username;
    let stockID = msg.stockID;
    let quantity = parseInt(msg.selectedAmount);
    let stockIndex = null;

    for (let i in stocks) {
        if (stocks[i].id === stockID) {
            stockIndex = i;
            break;
        }
    }

    for (let br of brokers) {
        if (br.name === user) {
            stocks[stockIndex].quantity -= quantity;
            br.wealth -= quantity * stocks[stockIndex].price;
            if (!br.stocks) br.stocks = {};
            if (!br.stocks[stockID]) {
                br.stocks[stockID] = 0;
            }
            br.stocks[stockID] += quantity;
        }
    }
}

function sellHandler(msg) {
    let user = msg.username;
    let stockID = msg.stockID;
    let quantity = parseInt(msg.selectedAmount);
    let stockIndex = null;
    for (let i in stocks) {
        if (stocks[i].id === stockID) {
            stockIndex = i;
            break;
        }
    }

    for (let i in brokers) {
        if (brokers[i].name === user) {
            stocks[stockIndex].quantity += quantity;
            brokers[i].wealth += quantity * stocks[stockIndex].price;
            brokers[i].stocks[stockID] -= quantity;
        }
    }
}

function randNorm() {
    let t = 0;
    let n = 3;
    for (let i = 0; i < n; ++i) {
        t += Math.random();
    }
    return t / n;
}

function updateStocksPrice() {
    for (let i in stocks) {
        if (stocks[i].type === "Равномерный") {
            stocks[i].price = Math.round(
                stocks[i].startingPrice +
                (Math.random() - 0.5) * stocks[i].maxChangeValue * 2
            );
        } else {
            stocks[i].price = Math.round(
                stocks[i].startingPrice +
                (randNorm() - 0.5) * stocks[i].maxChangeValue * 2
            );
        }
    }
}
