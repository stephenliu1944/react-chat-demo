import styles from './chat.css';
import React, { Component } from 'react';
import io from 'socket.io-client';
import uuidv4 from 'uuid/v4';
import { SocketEvent } from '../../constants/enum';
import InputMessage from '../../components/inputMessage/InputMessage';
import Screen from '../../components/screen/Screen';
import Message from '../../components/message/Message';
import { isVisibleChild, isNotEmpty } from '../../utils/util';

var socket;
const SERVER = `http://localhost:${__SOCKET_PORT__}`;     // websocket服务器地址

export default class Chat extends Component {

    constructor(props) {
        super(props);

        socket = io(SERVER);

        // 监听 websocket 连接建立
        socket.on('connect', () => {
            console.log('connected');
        });
        // 监听 websocket 连接断开
        socket.on('disconnect', (reason) => {
            console.log('disconnect');
            if (reason === 'io server disconnect') {
                socket.connect();
            }
        });
        // 监听错误事件
        socket.on('error', (reason) => {
            console.log('error', reason);
        });
    }

    state = {
        userId: uuidv4(),
        messageList: []
    }

    componentDidMount() {
        // socket.on(SocketEvent.LOGIN, (data) => {
        //     console.log('login', data);
        // });
        // socket.on(SocketEvent.USER_JOINED, (data) => {

        // });
        // socket.on(SocketEvent.USER_LEFT, (data) => {
        //     console.log('left', data);
        // });
        socket.on(SocketEvent.NEW_MESSAGE, (data) => {
            this.state.messageList.push(data);
            this.setState(this.state);
        });

        socket.on(SocketEvent.UPDATE_MESSAGE, (data) => {
            var hasUpdate = false;

            this.state.messageList.forEach((msg) => {
                var readerId = data[msg.id];
                // 当前消息不在阅读信息数组内.
                if (!readerId) {
                    return;
                }

                if (msg.readers.indexOf(readerId) === -1) {
                    msg.readers.push(readerId);
                    if (!hasUpdate) {
                        hasUpdate = true;
                    }
                }
            });

            if (hasUpdate) {
                this.setState(this.state);
            }
        });

        window.onfocus = this.checkUnreadMsg;
    }

    componentWillUnmount() {
        socket.disconnect();
        window.onfocus = null;
    }

    sendMessage = (message) => {
        var { userId, messageList } = this.state;
        var msg = {
            id: uuidv4(),               // 消息id
            owner: userId,              // 发送者id
            readers: [],                // 阅读者ids
            message                     // 消息体
        };

        messageList.push(msg);
        this.setState(this.state, () => {
            this.screen.scrollToBottom();
        });

        socket.emit(SocketEvent.NEW_MESSAGE, msg);
    }

    // 用户滚动滚动条的时候判断未读信息是否在可视区域
    checkUnreadMsg = () => {
        var readList = {};
        var userId = this.state.userId;
        var scrollTop = this.screen.ul.scrollTop;

        this.state.messageList.forEach((msg, index) => {
            // 过滤自己看了自己的消息
            if (userId === msg.owner) {
                return;
            }

            // 如果这个用户没读过, 则校验这条信息他是否能看见
            if (msg.readers.indexOf(userId) === -1) {
                var isVisible = isVisibleChild(index, scrollTop, Screen.height, Message.height);
                if (isVisible) {
                    // key 为消息id, value为阅读的用户
                    readList[msg.id] = userId;
                }
            }
        });

        if (isNotEmpty(readList)) {
            socket.emit(SocketEvent.UPDATE_MESSAGE, readList);
        }
    }

    render() {
        var { userId, messageList } = this.state;

        return (
            <div className={styles.chat}>
                <Screen master={userId} data={messageList} ref={(screen) => this.screen = screen} onScroll={this.checkUnreadMsg} />
                <InputMessage send={this.sendMessage} />
            </div>
        );
    }
}