import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import { App } from './App';
import * as serviceWorker from './serviceWorker';

import { library } from '@fortawesome/fontawesome-svg-core'
import { faSpinner, faSort } from '@fortawesome/free-solid-svg-icons'

library.add(faSpinner, faSort)

ReactDOM.render(<App />, document.getElementById('root'));

if (module.hot) {
  module.hot.accept()
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
