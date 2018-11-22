import React from "react";
import ReactDOM from "react-dom";

import "assets/css/material-dashboard-react.css?v=1.5.0";
import App from './containers/App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();