import React, {Component} from "react";

export default class Broker extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: props.name,
            brokers: props.brokers,
            selectedStock: 0,
            selectedAmount: 0,
            initialWorth: 0,
            currentWorth: 0,
            oldPrices: this.getPrices(),
        };

        this.setState({
                initialWorth: this.getWorth(),
                currentWorth: this.getWorth()
            }
        )
    }

    getPrices() {
        let prices = []
        for (let stock of this.props.stocks) {
            console.log(stock.price);
            prices.push(stock.price);
        }
        return prices;
    }

    getWorth() {
        let broker;
        for (let it of this.props.brokers) {
            if (it.name === this.props.name) {
                broker = it;
            }
        }
        let worth = 0;
        // console.log(this.props.stocks, this.state.oldPrices)
        for (let i in this.props.stocks) {
            let stock = this.props.stocks[i];
            let count = broker.stocks && broker.stocks[stock.id]
                ? broker.stocks[stock.id]
                : 0;
            // console.log(count, stock.price)
            worth += (stock.price - this.state.oldPrices[i]) * count
        }
        return worth;
    }


    setAmount = (event) => {
        if (parseInt(event.target.value) < 0) {
            this.setState({
                selectedAmount: 0
            })
            return;
        }
        this.setState({
            selectedAmount: parseInt(event.target.value)
        });
    };

    chooseStock = (id) => {
        let stocks = this.props.stocks;
        for (let i in stocks) {
            if (stocks[i].id === id) {
                this.setState({selectedStock: i});
            }
        }
    };

    buy = () => {
        // this.setState({
        //     currentWorth:
        //         this.state.initialWorth + this.props.stocks[this.state.selectedStock].price *
        //         this.state.selectedAmount
        // });
        this.props.buy(
            this.props.name,
            this.state.selectedStock,
            this.state.selectedAmount
        );
    };

    sell = () => {
        // this.setState({
        //     currentWorth:
        //         this.state.initialWorth - this.props.stocks[this.state.selectedStock].price *
        //         this.state.selectedAmount
        // });
        this.props.sell(
            this.props.name,
            this.state.selectedStock,
            this.state.selectedAmount
        );
    };

    render() {
        if (this.props.reset()) {
            this.setState({
                    oldPrices: this.getPrices(),
                    initialWorth: this.getWorth(),
                    currentWorth: this.getWorth()
                }
            )
            this.props.off();
        }
        if (!this.props.stocks) return null;
        if (!this.props.brokers) return null;
        let broker;
        for (let it of this.props.brokers) {
            if (it.name === this.props.name) {
                broker = it;
            }
        }
        let worth = this.getWorth();
        return (
            <div>
                <div>
                    <p>Имя брокера: {broker.name}</p>
                    <p>Денежный запас: {broker.wealth}</p>
                    <div>
                        <p>
                            Выбранная акция:{" "}
                            {this.props.stocks[this.state.selectedStock].id}{" "}
                        </p>
                        Количество:{" "}
                        <input
                            className=""
                            type="number"
                            onKeyPress="return event.charCode >= 48"
                            min="1"
                            onChange={this.setAmount}
                        />
                        <p>
                            Итоговая цена:{" "}
                            {this.props.stocks[this.state.selectedStock].price *
                            this.state.selectedAmount}
                        </p>
                        <p>
                            Доход:{" "}
                            {worth - this.state.initialWorth}
                        </p>
                    </div>
                    <div>
                        <button
                            className="w3-button w3-border"
                            onClick={this.buy}
                        >Купить
                        </button>
                        <button
                            className="w3-button w3-border"
                            onClick={this.sell}
                        >Продать
                        </button>
                    </div>
                    {this.props.message}
                </div>
                <table
                    className="w3-table w3-border w3-bordered w3-hoverable w3-centered"
                    id="stock_table"
                >
                    <thead>
                    <tr>
                        <th className="w3-center">Id</th>
                        <th className="w3-center">Цена</th>
                        <th className="w3-center">Количество</th>
                        <th className="w3-center">Кол-во купленных акция</th>
                        <th className="w3-center">Закон распределения</th>
                    </tr>
                    </thead>
                    {this.getRows(broker)}
                </table>
            </div>
        );
    }

    getRows(broker) {
        let tmp = [];
        for (let stock of this.props.stocks) {
            if (stock)
                tmp.push(
                    <tr
                        key={stock.id}
                        onClick={() => {
                            this.chooseStock(stock.id);
                        }}
                    >
                        <td className="w3-center">{stock.id}</td>
                        <td className="w3-center">{stock.price}</td>
                        <td className="w3-center">{stock.quantity}</td>
                        <td>
                            {broker.stocks && broker.stocks[stock.id]
                                ? broker.stocks[stock.id]
                                : "-"}
                        </td>
                        <td className="w3-center">{stock.type}</td>
                    </tr>
                );
        }
        return <tbody>{tmp}</tbody>;
    }

}