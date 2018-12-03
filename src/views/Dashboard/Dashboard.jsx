import React from "react";
import PropTypes from "prop-types";
// @material-ui/core
import withStyles from "@material-ui/core/styles/withStyles";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Accessibility from "@material-ui/icons/Accessibility";
// core components
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardIcon from "components/Card/CardIcon.jsx";
import CardBody from "components/Card/CardBody.jsx";
import CardFooter from "components/Card/CardFooter.jsx";
import constants from "variables/constants";
import request from 'utils/request';
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

class Dashboard extends React.Component {
  state = {
    value: 0,
    announcement: [],
    clients: {},
    shipowners: {},
    vessels: {}
  };
  componentDidMount() {
    this.getAnnouncement();
    this.getStats();
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  getAnnouncement = () => {
    const requestURL = constants.API_URL+'/announcement';

    request(requestURL, { method: 'GET' })
      .then(response => {
        const ann = [];
        for (let i = 0; i < response.rows.length; i++) {
          const announcement = [];
          const row = response.rows[i];
          announcement.push(row.time);
          announcement.push(row.subject);
          ann.push(announcement)
        }
        this.setState({announcement: ann});
      })
      .catch(err => {
        console.log('errr ==== ', err);
        this.setState({announcement: []});
      })
  };

  getStats = () => {
    const requestURL = constants.API_URL+'/statistics';

    request(requestURL, { method: 'GET' })
      .then(response => {
        this.setState({clients: response.clients});
        this.setState({shipowners: response.shipowners});
        this.setState({vessels: response.vessels});
      })
      .catch(err => {
        console.log('errr ==== ', err);
        this.setState({announcement: []});
      })
  };

  returnTopShipOwner = () => {
    let owners = "";
    if(this.state.shipowners.top_ship_owner){
      for (let i = 0; i < this.state.shipowners.top_ship_owner.length; i++) {
        const owner = this.state.shipowners.top_ship_owner[i];
        owners += owner.shipowner_name+" ("+owner.count+") <br/>";
      }
    }
    return owners;
  };

  returnTopClient = () => {
    let clients = "";
    if(this.state.clients.top_client){
      for (let i = 0; i < this.state.clients.top_client.length; i++) {
        const client = this.state.clients.top_client[i];
        clients += client.client_name+" ("+client.count+") <br/>";
      }
    }
    return clients;
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={8} md={4}>
            <Card>
              <CardHeader color="warning" stats icon>
                <CardIcon color="warning">
                  <Icon>directions_boat</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Vessels</p>
                <h3 className={classes.cardTitle}>
                  {this.state.vessels.count}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                {this.state.vessels.paying} are paying a monthly fee <br/>
                {this.state.vessels.demo} are in demo-period <br/>
                {this.state.vessels.not_pay} should not pay <br/>
                {this.state.vessels.labo} are installed in the labo <br/>
                {this.state.vessels.be_installed} are not installed yet <br/>
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={8} md={4}>
            <Card>
              <CardHeader color="success" stats icon>
                <CardIcon color="success">
                  <Icon>vpn_key</Icon>
                </CardIcon>
                <p className={classes.cardCategory}>Shipowners</p>
                <h3 className={classes.cardTitle}>
                  {this.state.shipowners.count}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div 
                  className={classes.stats}
                  dangerouslySetInnerHTML={{__html: this.returnTopShipOwner()}} >
                </div>
              </CardFooter>
            </Card>
          </GridItem>
          <GridItem xs={12} sm={8} md={4}>
            <Card>
              <CardHeader color="info" stats icon>
                <CardIcon color="info">
                  <Accessibility />
                </CardIcon>
                <p className={classes.cardCategory}>Clients</p>
                <h3 className={classes.cardTitle}>
                {this.state.clients.count}
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div 
                  className={classes.stats}
                  dangerouslySetInnerHTML={{__html: this.returnTopClient()}} >
                </div>
              </CardFooter>
            </Card>
          </GridItem>
        </GridContainer>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>Announcements</h4>
                <p className={classes.cardCategoryWhite}>
                  RH Box announcements
                </p>
              </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Date", "Subject"]}
                  tableData={this.state.announcement}
                />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
