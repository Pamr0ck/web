import React, {Component} from "react";

let admin;
export default class Admin extends Component {
    constructor(props, context) {
        super(props, context);
        let arr = []
        this.stocks = this.props.stocks;
        this.dump = this.props.dumpStocks;
        for (let x of this.props.stocks) {
            arr.push(x.type);
        }
        // console.log(arr);
        this.state = {value: arr};
        this.message = '';
        this.started = false;
        admin = this;
    }

    changeType(event) {
        event.preventDefault();
        // console.log(event);
        let arr = admin.state.value;
        arr[event.target.id] = event.target.value
        // console.log(event.target.id);
        // console.log(event.target.value);
        // console.log(event.target.value.id);
        admin.setState({value: arr});
        admin.stocks[event.target.id].type = event.target.value;
        console.log(admin.stocks)
        admin.dump(admin.stocks)
    }

    start() {
        admin.message = 'Идут торги!';
        admin.started = true;
        admin.props.startDay()
    }

    end() {
        admin.message = '';
        admin.started = false;
        admin.props.finishDay();
    }

    render() {
        return (
            <div>
                <p className="w3-xxlarge">Административная панель</p>
                <button
                    className="w3-button w3-border w3-margin-bottom"
                    onClick={this.start}
                >
                    Начать торги
                </button>
                <button
                    className="w3-button w3-border w3-margin-bottom"
                    onClick={this.end}
                >
                    Закончить торги
                </button>
                <p className="w3-xlarge">{this.message}</p>
                <table className="w3-table w3-border w3-bordered w3-centered">
                    <thead>
                    <tr>
                        <th className="w3-center">Имя</th>
                        <th className="w3-center">Денежный запас</th>
                        <th className="w3-center">Акции</th>
                    </tr>
                    </thead>
                    {BrokersTable(this.props.members)}
                </table>
                <table className="w3-table w3-border w3-bordered w3-centered">
                    <thead>
                    <tr>
                        <th className="w3-center">Акция</th>
                        <th className="w3-center">Тип распределения</th>
                    </tr>
                    </thead>
                    {StocksTable(this.props.stocks, this)}
                </table>
            </div>
        );

        function BrokersTableRow(_broker) {
            let broker = _broker.broker;
            return (
                <tr>
                    <td className="w3-center">{broker.name}</td>
                    <td className="w3-center">{broker.wealth}</td>
                    <td className="w3-center">{BrokerStocks(broker)}</td>
                </tr>
            );
        }

        function BrokerStocks(broker) {
            if (!broker.stocks) return "-";
            let tmp = [];
            for (let i in broker.stocks) {
                if (!broker.stocks[i]) {
                    continue;
                }
                tmp.push(
                    <p>
                        {i}: {broker.stocks[i]}
                    </p>
                );
            }
            if (tmp.length === 0) return "-";
            return <div> {tmp} </div>;
        }

        function BrokersTable(brokers) {
            let rows = [];
            for (let i in brokers) {
                rows.push(<BrokersTableRow broker={brokers[i]} key={i}/>);
            }
            return <tbody>{rows}</tbody>;
        }

        function StocksTable(stocks, p) {
            let rows = [];
            let j = 0;
            for (let i in stocks) {
                rows.push(<StocksTableRow stock={stocks[i]} key={i} j={j} p={p}/>);
                j++;
            }
            if (!admin.started) {
                return <tbody>{rows}</tbody>;
            }
            return <tbody></tbody>;
        }

        function StocksTableRow(_stock) {
            let stock = _stock.stock;
            return (
                <tr>
                    <td className="w3-center">{stock.id}</td>
                    <select
                        id={_stock.j}
                        className="w3-center"
                        value={_stock.p.state.value[_stock.j]}
                        onChange={_stock.p.changeType}>
                        <option value="Нормальный">Нормальный</option>
                        <option value="Равномерный">Равномерный</option>
                    </select>
                </tr>
            );
        }
    }
}