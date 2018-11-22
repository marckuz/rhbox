import React, { Component } from "react";
// import { createBrowserHistory } from "history";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import "assets/css/material-dashboard-react.css?v=1.5.0";

import indexRoutes from "routes/index.jsx";
import SignIn from "layouts/SignIn/SignIn.jsx";

// const hist = createBrowserHistory();

class App extends Component {
  constructor (props) {
    super(props);
    this.checkSession = this.checkSession.bind(this); 
  }
  state = {
    account : ''
  }
  componentDidMount() {
    this.checkSession(); 
  }
  checkSession(){
    console.log("localStorage.getItem('token')  === ", localStorage.getItem('token'));
    if(localStorage.getItem('token') === null || localStorage.getItem('token') === ''){
      return <Redirect to='/signin' />
    }
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Switch>
            <Route path="/signin" component={SignIn} />
            {indexRoutes.map((prop, key) => {
              return <Route path={prop.path} component={prop.component} key={key} />;
            })}
          </Switch>
        </div>
      </Router>
    );
  }
}


export default App;