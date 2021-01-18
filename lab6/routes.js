// eslint-disable-next-line no-unused-vars
const path = require("path");
const router = require("express").Router();
const debug = require("debug")("routes");

const brokerManager = require("./Server/BrokerManager");
const stockManager = require("./Server/StockManager");
const settingsManager = require("./Server/SettingsManager");

router.get("/", (req, res) => {
    res.end();
});

router.get("/data/brokers", (req, res) => {
    debug("Get /data/brokers");
    res.json(brokerManager.getData());
});
router.get("/data/brokerById/:id", (req, res) => {
    let id = req.params.id;
    debug("Get /data/brokerById/" + id);
    res.json(brokerManager.getDataById(id));
});
router.put("/data/broker/:id", (req, res) => {
    let id = req.params.id;
    debug("Put /data/broker/" + id + ", data:");
    debug(req.body);
    brokerManager.changeDataById(id, req.body);
    res.json(brokerManager.getData());
});

router.get("/data/stocks", (req, res) => {
    debug("Get /data/stocks");
    res.json(stockManager.getData());
});
router.get("/data/stockById/:id", (req, res) => {
    let id = req.params.id;
    debug("Get /data/stockById/" + id);
    res.json(stockManager.getDataById(id));
});
router.put("/data/stock/:id", (req, res) => {
    let id = req.params.id;
    debug("Put /data/stock/" + id + ", data:");
    debug(req.body);
    stockManager.changeDataById(id, req.body);
    res.json(stockManager.getData());
});

router.get("/data/settings", (req, res) => {
    debug("Get /data/settings");
    res.json(settingsManager.getData());
});

module.exports = router;
