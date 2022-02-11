import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import configureStore, { history } from './redux/configStore';
import { PersistGate } from 'redux-persist/integration/react'
import smoothscroll from 'smoothscroll-polyfill';
import { ConnectedRouter } from 'connected-react-router';
import { BrowserRouter } from 'react-router-dom';

smoothscroll.polyfill();

const { store } = configureStore({});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      {/* <PersistGate loading={null} persistor={persistor}> */}
      {/* <ConnectedRouter history={history}> */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/* </ConnectedRouter> */}
      {/* </PersistGate> */}
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
