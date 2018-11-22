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

import { announcement } from "variables/general.jsx";

import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";

class Dashboard extends React.Component {
  state = {
    value: 0
  };
  handleChange = (event, value) => {
    this.setState({ value });
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
                  18
                </h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                5 are paying a monthly fee <br/>
                1 are in demo-period <br/>
                5 should not pay <br/>
                5 are installed in the labo <br/>
                2 are not installed yet <br/>
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
                <h3 className={classes.cardTitle}>8</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  Radio Holland BE (7 Vessels) <br/>
                  PCCW (3 Vessels) <br/>
                  FSO Owner (2 Vessels) <br/>
                  OOS Owner (2 Vessels) <br/>
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
                <h3 className={classes.cardTitle}>2</h3>
              </CardHeader>
              <CardFooter stats>
                <div className={classes.stats}>
                  Radio Holland - BE (12 Vessels) <br/>
                  Radio Holland - NL (6 Vessels)
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
                  tableHead={[""]}
                  tableData={[announcement]}
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
