/*global google*/
import React from "react"
import { compose, withProps, lifecycle, withStateHandlers, withHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";
import { InfoBox } from "react-google-maps/lib/components/addons/InfoBox";
import constants from "variables/constants";
import request from 'utils/request';
import general from 'variables/general';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Icon from '@material-ui/core/Icon';

const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key="+constants.GOOGLE_API_KEY+"&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100vh` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers()
    },
  }),
  lifecycle({
    componentWillMount() {
      this.setState({
        vessels: [],

        toggleVesselInfo: (vessel) => {
            this.props.toggleVesselInfo(vessel);
        },
        getVesselIcon: (vessel) => {
          return this.props.getVesselIcon(vessel);
        }
      })
    },
    
    componentWillReceiveProps: function(nextProps) {
      this.setState({
        vessels : nextProps.vessels ? nextProps.vessels : []
      })
    },
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={3}
    defaultCenter={{ lat: 28.14002, lng:-15.42113 }}
  >
    <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
      {/* {console.log('vessels = ', props.vessels)} */}

      {Object.keys(props.vessels).map(function(key){
          const vessel = props.vessels[key];
          let markerIcon = props.getVesselIcon(vessel);
          if(parseFloat(vessel.lat) === 0 || parseFloat(vessel.long) === 0){
            return;
          }

          return <Marker 
            position={{ lat: parseFloat(vessel.lat), lng: parseFloat(vessel.long) }} 
            icon={{
              url: markerIcon, 
              anchor: new google.maps.Point(25, 25),
            }}
            onClick={()=>{props.toggleVesselInfo(props.vessels[key])}}
            obj={vessel} 
            key={key} >
               {props.vessels[key].isOpen && <InfoBox
                position={{ lat: parseFloat(vessel.lat), lng: parseFloat(vessel.long) }} 
                options={{ 
                  pane: "overlayLayer",
                  alignBottom: true,
                  pixelOffset: new google.maps.Size(-135, -25),
                  enableEventPropagation: true,
                  closeBoxURL : ""
                 }}
              >
                 <div className="map-popover">
                  <div className="popover-header">
                    <p className="title">
                      <span className="device-name">
                        {vessel.vessel_name}
                      </span>
                    </p>
                    <span className="popover-close" title="OFF" onClick={()=>{props.toggleVesselInfo(props.vessels[key])}}>×</span>
                  </div>
                  <div className="popover-body">
                    <div className="popover-body-bottom">
                      <p className="item">
                        <span className="title" title="Position Source">Position Source: </span>
                        <span className="text" title={vessel.position_source}>
                          {vessel.position_source}
                        </span>
                      </p>
                      <p className="item">
                        <span className="title" title="Position">Position: </span>
                        <span className="text" title={general.convertDMS(vessel.lat, vessel.long)}>
                          {general.convertDMS(vessel.lat, vessel.long)}
                        </span>
                      </p>
                      {vessel.heading > 0 && <p className="item">
                        <span className="title" title="Heading Source">Heading Source: </span>
                        <span className="text" title={vessel.heading_source}>
                          {vessel.heading_source}
                        </span>
                      </p>
                      }
                      {vessel.heading > 0 && <p className="item">
                        <span className="title" title="Heading">Heading: </span>
                        <span className="text" title={vessel.heading}>
                          {vessel.heading}
                        </span>
                      </p>
                       }
                       <p className="item">
                        {/* <a href="/device/">Goto</a> */}
                        <Button size="small" variant="contained" color="default">
                          Goto
                          <Icon>navigate_next</Icon>
                        </Button>
                       </p>
                    </div>
                  </div>
                  {/* <div className="popover-footer">
                  </div> */}
                </div>
              </InfoBox>
              }
            </Marker>
            ;
      })}
    </MarkerClusterer>
  </GoogleMap>
);


class MyFancyComponent extends React.PureComponent {
  state = {
    vessels: []
  }

  componentDidMount() {
    this.getVessels();
  }

  toggleVesselInfo = (vessel, shoulOpen=false) => {
    let vessels = Object.assign([], this.state.vessels);
    for(let i in vessels){
      if(vessels[i].vessel_id != vessel.vessel_id){
        vessels[i].isOpen = false;
      }else{
        vessels[i].isOpen = !vessel.isOpen;
        if(shoulOpen){
          vessels[i].isOpen = true;
        }
      }
    }
    this.setState({vessels});
  }

  getVesselIcon = (vessel) =>{
    let iconUrl="";
    if(vessel.heading >= 20 && vessel.heading <= 90){
      iconUrl = '-02.png' 
    }else if(vessel.heading >= 45 && vessel.heading <= 135) {
      iconUrl = '-03.png' 
    }else if(vessel.heading >= 90 && vessel.heading <= 180) {
      iconUrl = '-04.png' 
    }else if(vessel.heading >= 135 && vessel.heading <= 225) {
      iconUrl = '-05.png' 
    }else if(vessel.heading >= 180 && vessel.heading <= 270) {
      iconUrl = '-06.png' 
    }else if(vessel.heading >= 225 && vessel.heading <= 315) {
      iconUrl = '-07.png' 
    }else if(vessel.heading >= 360){
      iconUrl = '-01.png' 
    }else{
      iconUrl = '.png' 
    }
    let markerIcon = require('assets/img/ship/black/ship_0' + iconUrl);
    if(vessel.update_state === 2){
      markerIcon = require('assets/img/ship/red/ship_0' + iconUrl);
    } else if (vessel.update_state === 1){
      markerIcon = require('assets/img/ship/green/ship_0' + iconUrl);
    }

    if(vessel.heading === 0){
      markerIcon = require('assets/img/ship/round.png');
    }
    // console.log('markerIcon ================= ', markerIcon);
    return markerIcon;
  }

  getVessels = () => {
    const requestURL = constants.API_URL+'/load/vessels/data';

    request(requestURL, { method: 'GET' })
      .then(response => {
        if(response.alert){
          localStorage.clear();
          sessionStorage.clear();
          this.props.history.push('/signin')
        }
        this.setState({vessels: response.rows});
      })
      .catch(err => {
        console.log('errr ==== ', err);
      });
  };

  generateList() {
    return this.state.vessels.map(vessel =>
      <ListItem 
        key={`item-${vessel.vessel_id}`}
        // onMouseOver={this.toggleVesselInfo(vessel, true)}
        >
        <ListItemAvatar>
          <Avatar 
            src={this.getVesselIcon(vessel)}
          />
        </ListItemAvatar>
        <ListItemText
          primary={vessel.vessel_name}
          secondary={null}
        />
      </ListItem>,
    );
  }

  render() {
    return (
      <div>
        <List className="maplist" dense={true}>
          {this.generateList()}
        </List>
        <MyMapComponent
          vessels={this.state.vessels}
          toggleVesselInfo={this.toggleVesselInfo}
          getVesselIcon={this.getVesselIcon}
        />
      </div>
    )
  }
}
export default MyFancyComponent;