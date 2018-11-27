import React from "react"
import { compose, withProps, lifecycle, withHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker  } from "react-google-maps"
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";
import constants from "variables/constants";
import request from 'utils/request';

const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key="+constants.GOOGLE_API_KEY,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100vh` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers()
      console.log(`Current clicked markers length: ${clickedMarkers.length}`)
      console.log(clickedMarkers)
    },
  }),
  lifecycle({
    componentWillMount() {
      this.setState({
        vessels : []
      })
      console.log('componentWillMount = ');
    },
    componentWillReceiveProps: function(nextProps) {
      console.log('componentWillReceiveProps = ');
      
      this.setState({
        vessels : nextProps.vessels ? nextProps.vessels : {}
      })
    },
  }),
  withScriptjs,
  withGoogleMap
)((props) =>
  <GoogleMap
    defaultZoom={10}
    defaultCenter={{ lat: 51.33383, lng: 3.20050 }}
  >
    <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
      {console.log('vessels = ', props.vessels)}

      {props.isMarkerShown && props.vessels.map(function(vessel, i){
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
          // iconUrl =  "assets/img/favicon_rh-48x48.png";
          // console.log('iconUrl : ', 'assets/img/ship/black/ship_0' + iconUrl);
          let markerIcon = require('assets/img/ship/black/ship_0' + iconUrl);
          if(vessel.update_state === 2){
            markerIcon = require('assets/img/ship/red/ship_0' + iconUrl);
          } else if (vessel.update_state === 1){
            markerIcon = require('assets/img/ship/green/ship_0' + iconUrl);
          }
          return <Marker 
            position={{ lat: parseFloat(vessel.lat), lng: parseFloat(vessel.long) }} 
            icon={{
              url: markerIcon, 
              // anchor: new google.maps.Point(25, 25),
            }}
            onClick={props.onMarkerClick} 
            obj={vessel} 
            key={i} />;
      })}
    </MarkerClusterer>
  </GoogleMap>
);


class MyFancyComponent extends React.PureComponent {
  state = {
    isMarkerShown: true,  
    vessels: []
  }

  componentDidMount() {
    this.getVessels();
    // this.delayedShowMarker();
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 100)
  }

  handleMarkerClick = () => {
    // this.setState({ isMarkerShown: false })
    this.delayedShowMarker()
  }

  getVessels = () => {
    const requestURL = constants.API_URL+'/load/vessels/data';

    request(requestURL, { method: 'GET' })
      .then(response => {
        console.log('response ==== ', response.rows);
        this.setState({vessels: response.rows});
      })
      .catch(err => {
        console.log('errr ==== ', err);
      });
  };

  render() {
    return (
      <MyMapComponent
        isMarkerShown={this.state.isMarkerShown}
        onMarkerClick={this.handleMarkerClick}
        vessels={this.state.vessels}
      />
    )
  }
}
export default MyFancyComponent;