// eslint-disable-next-line no-unused-vars
import React, { Component } from "react";

export default class Authorization extends Component {
    render() {
        return (
            <div>
                <form onSubmit={this.props.login}>
                    <p>Введите ваше имя</p>
                    <p>
                        <input type="text" name="name" placeholder="Имя" />
                    </p>
                    <p>
                        <button className="w3-btn w3-green">Войти</button>
                    </p>
                </form>
                {this.props.message}
            </div>
        );
    }
}