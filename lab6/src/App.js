import React, {Component} from "react";
import Authorization from "./components/auth";
import Admin from "./components/admin";
import Broker from "./components/broker";

import "./css/App.css";
import * as io from "socket.io-client";

let socket;

class App extends Component {
    state = {
        username: "",
        stocks: null,
        brokers: null,
        settings: null,
        trading: false,
        message: "",
        reset: true,
    };

    componentDidMount() {
        fetch("http://localhost:80/data/stocks", {
            headers: {"Content-Type": "application/json"},
        })
            .then((res) => res.json())
            .then((response) => {
                this.setState({stocks: response});
            });

        fetch("http://localhost:80/data/brokers", {
            headers: {"Content-Type": "application/json"},
        })
            .then((res) => res.json())
            .then((response) => {
                this.setState({brokers: response});
                // console.log(response);
            });

        fetch("http://localhost:80/data/settings", {
            headers: {"Content-Type": "application/json"},
        })
            .then((res) => res.json())
            .then((response) => this.setState({settings: response}));
    }

    login = (event) => {
        event.preventDefault(); // Prevents the page from reloading
        let name = event.target.elements.name.value; // Taking a value from input at auth component

        // Check if this user exists
        let b = false;
        if (!this.state.brokers) {
            console.log(this.state);
            return;
        }
        for (let it of this.state.brokers) {
            if (it.name === name) {
                b = true;
                break;
            }
        }
        if (!b && name !== "admin") {
            this.setState({message: "Нет такого пользователя"});
            return;
        }

        this.setState({username: name, message: ""});
        socket = io("http://localhost");
        socket.on("connect", () => {
            socket.emit("connected", {name: this.state.username});
        });
        socket.on("update", (info) => {
            console.log(info);
            this.setState({
                stocks: info.stocks,
                brokers: info.brokers,
                trading: info.trading,
            });
        });
        socket.on("reset", (x) => {
            // console.log(info);
            this.setState({
                reset: true,
            })
        });
    };
    //
    // Check that there's enough stocks to buy, amount is correct and app is trading
    checkActionAttempt = (stockIndex, amount) => {
        if (!amount || amount <= 0) {
            this.setState({ message: "Некорректное количество" });
            alert("Некорректное количество");
            return 0;
        }
        console.log(this.state);
        if (!this.state.trading) {
            this.setState({ message: "Торги не начались" });
            alert("Торги не начались");
            return 0;
        }

        return 1;
    };

    buy = (username, stockIndex, amount) => {
        if (!this.checkActionAttempt(stockIndex, amount)) return;
        console.log(this.state.stocks[stockIndex].quantity);
        if (this.state.stocks[stockIndex].quantity < amount) {
            this.setState({ message: "Общее количество акций меньше запрашиваемого" });
            return;
        }

        let userIndex = null;
        // Get the index of the user
        for (let i in this.state.brokers) {
            if (this.state.brokers[i].name === username) {
                userIndex = i;
                break;
            }
        }

        // Check if broker has enough money for purchasing
        if (
            this.state.brokers[userIndex].wealth <
            amount * this.state.stocks[stockIndex].price
        ) {
            this.setState({ message: "У Вас недостаточно средств" });
            return;
        }

        this.setState({ message: "" });
        socket.emit("buy", {
            username: username,
            stockID: this.state.stocks[stockIndex].id,
            selectedAmount: amount,
        });
    };

    sell = (username, stockIndex, amount) => {
        if (!this.checkActionAttempt(stockIndex, amount)) return;

        let userIndex = null;
        // Get the index of the user
        for (let i in this.state.brokers) {
            if (this.state.brokers[i].name === username) {
                userIndex = i;
                break;
            }
        }

        let stockID = this.state.stocks[stockIndex].id;
        if (
            !this.state.brokers[userIndex].stocks ||
            !this.state.brokers[userIndex].stocks[stockID] ||
            this.state.brokers[userIndex].stocks[stockID] < amount
        ) {
            this.setState({ message: "У Вас недостаточное количество акций" });
            return;
        }

        this.setState({ message: "" });
        socket.emit("sell", {
            username: username,
            stockID: stockID,
            selectedAmount: amount,
        });
    };

    isReset = () => {
        return this.state.reset;
    }
    off = () => {
        this.setState({
            reset: false,
        });
    }

    startDay = () => {
        socket.emit("start");
    };
    finishDay = () => {
        socket.emit("finish");
    };
    dumpStocks = (stocks) => {
        socket.emit("dumpStocks", {stocks: stocks});
    };


    render() {
        return <div className="App">{this.getContent()}</div>;
    }

    getContent() {
        let content;
        if (this.state.username === "")
            content = (
                <Authorization
                    className="w3-center"
                    login={this.login}
                    message={this.state.message}
                />
            );
        else if (this.state.username === "admin")
            content = (
                <Admin
                    startDay={this.startDay}
                    finishDay={this.finishDay}
                    dumpStocks={this.dumpStocks}
                    stocks={this.state.stocks}
                    members={this.state.brokers}
                    setting={this.state.settings}
                    message=''
                />
            );
        else {
            content = (
                <Broker
                    buy={this.buy}
                    sell={this.sell}
                    name={this.state.username}
                    stocks={this.state.stocks}
                    brokers={this.state.brokers}
                    message={this.state.message}
                    reset={this.isReset}
                    off={this.off}
                />
            );
        }
        return content;
    }
}

export default App;