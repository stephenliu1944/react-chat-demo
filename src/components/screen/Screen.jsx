import styles from './screen.css';
import React, { Component } from 'react';
import Message from '../message/Message';

export default class Screen extends Component {

    constructor(props) {
        super(props);
    }
    
    static height = 200;    // 组件高度
    
    scrollToBottom = () => {
        var ul = this.ul;
        ul.scrollTop = ul.scrollHeight;
    }

    render() {
        var { master, data = [] } = this.props;
        
        return (
            <ul className={styles.screen} ref={(ul) => this.ul = ul} onScroll={this.props.onScroll}>
                {                
                    data.map((data, index) => {                        
                        let { id, owner, readers, message } = data;
                        return <Message key={id} value={message} owner={owner} readers={readers} isSelf={master === owner} />;
                    })
                }
            </ul>
        );
    }
}