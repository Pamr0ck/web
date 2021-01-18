const debug = require("debug")("manager");
const fs = require("fs");
const DataPath = __dirname + "/data/";

class ManagerBase {
  constructor(file) {
    this.file = DataPath + file;
    this.data = [];
    try {
      let str = fs.readFileSync(this.file, "utf-8");
      if (!str) return;
      this.data = JSON.parse(str);
    } catch (err) {
      // Process read error
      if (err.code == "ENOENT") {
        this.data = [];
        try {
          fs.writeFileSync(this.file, JSON.stringify(this.data));
        } catch (err) {
          console.log(err);
          throw err;
        }
        console.log("No data file on server, new file was created:");
      } else {
        console.log(err);
        throw err;
      }
    }
  }

  saveData() {
    fs.writeFileSync(this.file, JSON.stringify(this.data), (err) => {
      if (err) console.log(err);
    });
  }

  addData(data) {
    let id;
    if (this.data.length > 0)
      id = parseInt(this.data[this.data.length - 1].id) + 1;
    else id = 1;
    data.id = id;
    this.data[this.data.length] = data;
    debug("Added data:");
    debug(data);
    this.saveData();
  }

  getData() {
    return this.data;
  }

  getDataById(id) {
    for (let it of this.data)
      if (it.id == id) {
        return it;
      }
  }

  removeDataById(id) {
    debug("Removing data with id " + id);
    for (let i = 0; i < this.data.length; ++i) {
      if (this.data[i].id == id) {
        this.data.splice(i, 1);
        this.saveData();
      }
    }
  }

  changeData(data) {
    this.data = data;
    this.saveData();
  }

  changeDataByIndex(index, newData) {
    newData.id = this.data[index].id;
    this.data[index] = newData;
    debug("Changing data to:");
    debug(newData);
    this.saveData();
  }

  /**
   * Returns 1 if changing data succeed
   * Returns 0 if object with proper id wasn't found.
   * @param {*} id
   * @param {*} newData
   */
  changeDataById(id, newData) {
    for (let i in this.data) {
      if (this.data[i].id == id) {
        newData.id = id;
        this.data[i] = newData;
        debug("Changing data to:");
        debug(newData);
        this.saveData();
        return 1;
      }
    }
    debug("data with id " + id + " wasn't found.");
    return 0;
  }
}

module.exports = ManagerBase;
