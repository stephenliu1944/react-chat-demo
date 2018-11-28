import './styles/main';
import React from 'react';
import { render } from 'react-dom';
import 'core-js/fn/promise';
import Chat from './containers/chat/Chat';

if (__DEV__) {
    import('react-addons-perf').then((Perf) => {
        Perf.start();
        window.Perf = Perf;
    });
}

render(
    <Chat />,
    document.getElementById('app')
);

