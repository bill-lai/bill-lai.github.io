import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app';
import 'src/assets/style/public.scss'
import { BrowserRouter as Router } from 'react-router-dom'
import { injeState } from './state'

if ((window as any).globalState) {
  injeState((window as any).globalState)
}

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
