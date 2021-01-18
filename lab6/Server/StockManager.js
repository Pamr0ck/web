const Manager = require("./ManagerBase");
const stockManager = new Manager("stocks.json");

for (let i in stockManager.data) {
    if (!stockManager.data[i].price) {
        stockManager.data[i].price = stockManager.data[i].startingPrice;
    }
}
stockManager.saveData();

module.exports = stockManager;
