import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './app';
import { BrowserRouter as Router } from 'react-router-dom'
import { injectState } from './state'
import { injectPlatform } from './platform'

if ((window as any).globalState) {
  injectState((window as any).globalState)
}

injectPlatform({
  setAppTitle: title => document.title = title,
  getAppTitle: () => document.title
})

ReactDOM.hydrate(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
