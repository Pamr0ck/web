const path = require("path");
const router = require("express").Router();

const brokerManager = require("./Server/BrokerManager");
const stockManager = require("./Server/StockManager");
const settingsManager = require("./Server/SettingsManager");

// Broker requests:
router.get("/api/brokers", (req, res) => {
  res.send(brokerManager.getData());
});
router.post("/api/brokers", (req, res) => {
  brokerManager.addData(req.body);
  res.send(brokerManager.getData());
});
router.put("/api/brokers/:id", (req, res) => {
  let id = req.params.id;
  brokerManager.changeDataById(id, req.body);
  res.send(brokerManager.getData());
});
router.delete("/api/brokers/:id", (req, res) => {
  let id = req.params.id;
  brokerManager.removeDataById(id);
  res.send(brokerManager.getData());
});

// Stock requests:
router.get("/api/stocks", (req, res) => {
  res.send(stockManager.getData());
});
router.post("/api/stocks", (req, res) => {
  stockManager.addData(req.body);
  res.send(stockManager.getData());
});
router.put("/api/stocks/:id", (req, res) => {
  let id = req.params.id;
  stockManager.changeDataById(id, req.body);
  res.send(stockManager.getData());
});
router.delete("/api/stocks/:id", (req, res) => {
  let id = req.params.id;
  stockManager.removeDataById(id);
  res.send(stockManager.getData());
});

// Settings requests:
router.get("/api/settings", (req, res) => {
  res.send(settingsManager.getData());
});
router.put("/api/settings", (req, res) => {
  settingsManager.changeData(req.body);
  res.end();
});

module.exports = router;
