import styles from './message.css';
import React, { Component } from 'react';

export default class Message extends Component {

    constructor(props) {
        super(props);
    }

    static height = 30;    // 组件高度

    showReader = () => {
        if (this.props.readers.length > 0) {
            alert(this.props.readers.join('\r'));
        }
    }

    render() {
        var { value, owner, isSelf, readers } = this.props;

        return (
            <li className={`${styles.message}`}>
                <span className={`${styles.name}`}>{isSelf ? 'You' : owner}:</span>
                <span className={`${styles.info}`}>{value}</span>
                {isSelf ? <span className={`${styles.read} `} onClick={this.showReader}>{readers.length > 0 ? `(已读${readers.length})` : '(未读)'}</span> : null}
            </li>
        );
    }
}