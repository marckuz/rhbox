import React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

import signInStyle from "assets/jss/material-dashboard-react/layouts/signInStyle.jsx";
import constants from "variables/constants";
import request from 'utils/request';
import auth from 'utils/auth';

import image from "assets/img/sidebar-2.jpg";

class SignIn extends React.Component {

  login = e => {
    e.preventDefault();
    const body = this.state.value;
    const email = body.email;
    const pwd = body.password;
    const requestURL = constants.API_URL+'/user/login';
    const params = {
      email: email,
      password: pwd
    }
    console.log('bodyy -- ', body);

    request(requestURL, { method: 'POST', body: params }, true)
      .then(response => {
        console.log('response ==== ', response);

        auth.setToken(response.jwt, body.rememberMe);
        auth.setUserInfo(response.user, body.rememberMe);
        this.redirectUser();
      })
      .catch(err => {
        // TODO handle errors for other views
        // This is just an example
        // const errors = [
        //   { name: 'identifier', errors: [err.response.payload.message] },
        // ];
        console.log('errr ==== ', err);
        // this.setState({ didCheckErrors: !this.state.didCheckErrors, errors });
      });
  };

  handleChange = ({ target }) => {
    this.setState({
      value: { ...this.state.value, [target.name]: target.value },
    });
  }
    
  redirectUser = () => {  
    this.props.history.push('/');
  }

  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      redirectToReferrer: false,
      value: {}, 
      errors: [], 
      didCheckErrors: false
    };
    this.resizeFunction = this.resizeFunction.bind(this);
  }
  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };
  getRoute() {
    return this.props.location.pathname !== "/maps";
  }
  resizeFunction() {
    if (window.innerWidth >= 960) {
      this.setState({ mobileOpen: false });
    }
  }
  componentDidMount() {
    if (navigator.platform.indexOf("Win") > -1) {
    }
    window.addEventListener("resize", this.resizeFunction);
  }
  componentDidUpdate(e) {
    if (e.history.location.pathname !== e.location.pathname) {
      this.refs.mainPanel.scrollTop = 0;
      if (this.state.mobileOpen) {
        this.setState({ mobileOpen: false });
      }
    }
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.resizeFunction);
  }
  render() {
    const { classes, ...rest } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline />
        {image !== undefined ? (
            <div
              className={classes.background}
              style={{ backgroundImage: "url(" + image + ")" }}
            />
          ) : null}
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={this.login}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input 
                onChange={this.handleChange} 
                id="email" 
                name="email" 
                autoComplete="email" 
                autoFocus />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input 
                onChange={this.handleChange} 
                name="password"
                type="password" 
                id="password" 
                autoComplete="current-password" />
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox 
                onChange={this.handleChange} 
                value="rememberMe"
                name="rememberMe"
                color="primary" />
              }
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign in
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}

SignIn.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(signInStyle)(SignIn);
