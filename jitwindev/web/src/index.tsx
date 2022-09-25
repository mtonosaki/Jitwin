import React from 'react';
import ReactDOM from 'react-dom';
import 'index.css';
import { BrowserRouter } from 'react-router-dom';
import App from 'App';
import { RecoilRoot } from 'recoil';

ReactDOM.render(
  <BrowserRouter>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </BrowserRouter>,
  document.getElementById('root')
);
