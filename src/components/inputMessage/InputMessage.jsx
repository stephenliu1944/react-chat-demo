import styles from './inputMessage.css';
import React, { PureComponent } from 'react';
import { batchCreateItems } from '../../utils/util';

export default class InputMessage extends PureComponent {

    constructor(props) {
        super(props);
        
        this.state = {
            columns: batchCreateItems(10)
        };
    }
    
    static height = 200;    // 行高

    handleEnter = (e) => {
        var val = e.target.value || '';
        val = val.trim();
        
        if (e.keyCode === 13 && val.length > 0) {
            e.target.value = '';
            this.props.send(val);
        }
    }

    render() {
        var { show } = this.props;

        return <input className={styles.inputMessage} placeholder="Type here..." onKeyUp={ this.handleEnter } />;
        
    }
}