/*global google*/
import React from "react"
import { compose, withProps, lifecycle, withStateHandlers, withHandlers } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import { MarkerClusterer } from "react-google-maps/lib/components/addons/MarkerClusterer";
import { InfoBox } from "react-google-maps/lib/components/addons/InfoBox";
import constants from "variables/constants";
import request from 'utils/request';

const MyMapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key="+constants.GOOGLE_API_KEY+"&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `100vh` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  withStateHandlers(() => ({
    isOpen: true,
  }), {
    onToggleOpen: ({ isOpen }) => () => ({
      isOpen: !isOpen,
    })
  }),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers()
    },
  }),
  lifecycle({
    componentWillMount() {
      this.setState({
        vessels: {},

        toggleVesselInfo: (vessel) => {
            this.props.toggleVesselInfo(vessel);
        }
      })
    },
    
    componentWillReceiveProps: function(nextProps) {
      this.setState({
        vessels : nextProps.vessels ? nextProps.vessels : {}
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
      {console.log('vessels = ', props.vessels)}

      {Object.keys(props.vessels).map(function(key){
          const vessel = props.vessels[key];

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
          // console.log('iconUrl : ', 'assets/img/ship/black/ship_0' + iconUrl);
          let markerIcon = require('assets/img/ship/black/ship_0' + iconUrl);
          if(vessel.update_state === 2){
            markerIcon = require('assets/img/ship/red/ship_0' + iconUrl);
          } else if (vessel.update_state === 1){
            markerIcon = require('assets/img/ship/green/ship_0' + iconUrl);
          }

          if(vessel.heading === 0){
            markerIcon = require('assets/img/ship/round.png');
          }
          console.log('markerIcon == ', markerIcon);
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
                    <p clas="title">
                      <span className="device-name">
                        {vessel.vessel_name}
                      </span>
                      <span className="imei" title={vessel.vessel_id}>
                        {vessel.vessel_id}
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
                        <span className="text" title={vessel.long +" "+vessel.lat}>
                          {vessel.long +" "+vessel.lat}
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
                    </div>
                  </div>
                  <div className="popover-footer">
                  </div>
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
    vessels: {}
  }

  componentDidMount() {
    this.getVessels();
  }

  toggleVesselInfo = (vessel) => {

    let vessels = Object.assign({}, this.state.vessels);

    for(let i in vessels){
      if(vessels[i].vessel_id != vessel.vessel_id){
        vessels[i].isOpen = false;
      }else{
        vessels[i].isOpen = !vessel.isOpen;
      }
    }
    this.setState({vessels});
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
        this.setState({vessels: []});
        // this.setState({vessels: [
        //   {
        //     "heading": 0,
        //     "heading_source": "",
        //     "isOpen": false,
        //     "lat": "51.33383",
        //     "long": "3.20050",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "8222563",
        //     "vessel_name": "BNS Belgica"
        //   },
        //   {
        //     "heading": "317.0",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "34.90366",
        //     "long": "123.54204",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "8769781",
        //     "vessel_name": "OOS Prometheus"
        //   },
        //   {
        //     "heading": "232.9",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "54.38697",
        //     "long": "6.37854",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "8771071",
        //     "vessel_name": "JB 117"
        //   },
        //   {
        //     "heading": "177.3",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "51.46115",
        //     "long": "3.68388",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9125372",
        //     "vessel_name": "Celestine"
        //   },
        //   {
        //     "heading": "184.9",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "57.69091",
        //     "long": "11.84271",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9125384",
        //     "vessel_name": "Clementine"
        //   },
        //   {
        //     "heading": "349.1",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "51.34216",
        //     "long": "3.21633",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9166625",
        //     "vessel_name": "Valentine"
        //   },
        //   {
        //     "heading": "14.9",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "51.58683",
        //     "long": "3.17948",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9166637",
        //     "vessel_name": "Melusine"
        //   },
        //   {
        //     "heading": "123.1",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "51.46999",
        //     "long": "0.25263",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9183984",
        //     "vessel_name": "Celandine"
        //   },
        //   {
        //     "heading": "134.1",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "51.52067",
        //     "long": "2.79461",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9184029",
        //     "vessel_name": "Victorine"
        //   },
        //   {
        //     "heading": 0,
        //     "heading_source": "",
        //     "isOpen": false,
        //     "lat": 0,
        //     "long": 0,
        //     "position_source": "",
        //     "update_state": 2,
        //     "vessel_id": "9193707",
        //     "vessel_name": "Rosina Topic"
        //   },
        //   {
        //     "heading": "323.7",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "51.89835",
        //     "long": "4.23228",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9209453",
        //     "vessel_name": "Catherine"
        //   },
        //   {
        //     "heading": "277.0",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "26.59161",
        //     "long": "52.03791",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9224752",
        //     "vessel_name": "FSO Asia"
        //   },
        //   {
        //     "heading": "351.0",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "26.66667",
        //     "long": "51.90000",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9224764",
        //     "vessel_name": "FSO Africa"
        //   },
        //   {
        //     "heading": 0,
        //     "heading_source": "",
        //     "isOpen": false,
        //     "lat": 0,
        //     "long": 0,
        //     "position_source": "",
        //     "update_state": 2,
        //     "vessel_id": "9251327",
        //     "vessel_name": "Lissa Topic"
        //   },
        //   {
        //     "heading": 0,
        //     "heading_source": "",
        //     "isOpen": false,
        //     "lat": 0,
        //     "long": 0,
        //     "position_source": "",
        //     "update_state": 2,
        //     "vessel_id": "9309655",
        //     "vessel_name": "Jalma Topic"
        //   },
        //   {
        //     "heading": "323.4",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "53.66995",
        //     "long": "-0.23497",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9324473",
        //     "vessel_name": "Pauline"
        //   },
        //   {
        //     "heading": "286.6",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "51.89696",
        //     "long": "4.23778",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9337353",
        //     "vessel_name": "Yasmine"
        //   },
        //   {
        //     "heading": "11.7",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "51.78756",
        //     "long": "-5.81552",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9376696",
        //     "vessel_name": "Mazarine"
        //   },
        //   {
        //     "heading": "257.0",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "50.04303",
        //     "long": "-2.56333",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9376701",
        //     "vessel_name": "Palatine"
        //   },
        //   {
        //     "heading": "33.1",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "44.31017",
        //     "long": "-8.97643",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9376713",
        //     "vessel_name": "Vespertine"
        //   },
        //   {
        //     "heading": "276.3",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "53.34427",
        //     "long": "-6.19806",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9376725",
        //     "vessel_name": "Peregrine"
        //   },
        //   {
        //     "heading": "188.6",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "-35.14860",
        //     "long": "109.56427",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9420837",
        //     "vessel_name": "Donaugracht"
        //   },
        //   {
        //     "heading": "158.4",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "51.46475",
        //     "long": "0.34129",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9424869",
        //     "vessel_name": "Opaline"
        //   },
        //   {
        //     "heading": "303.4",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "51.47122",
        //     "long": "0.24983",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9424871",
        //     "vessel_name": "Amandine"
        //   },
        //   {
        //     "heading": "205.3",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "67.28820",
        //     "long": "14.38883",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9539066",
        //     "vessel_name": "Capucine"
        //   },
        //   {
        //     "heading": "153.3",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "46.78203",
        //     "long": "-5.13176",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9539078",
        //     "vessel_name": "Severine"
        //   },
        //   {
        //     "heading": "230.9",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "51.35112",
        //     "long": "3.18780",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9539080",
        //     "vessel_name": "Wilhelmine"
        //   },
        //   {
        //     "heading": "282.4",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "51.57845",
        //     "long": "2.65179",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9539092",
        //     "vessel_name": "Adeline"
        //   },
        //   {
        //     "heading": "123.8",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "51.22775",
        //     "long": "2.93434",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9622681",
        //     "vessel_name": "Simon Stevin"
        //   },
        //   {
        //     "heading": "007.1",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "-22.39950",
        //     "long": "-39.96550",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9650963",
        //     "vessel_name": "OOS Gretha"
        //   },
        //   {
        //     "heading": "314.1",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "28.14002",
        //     "long": "-15.42113",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9714185",
        //     "vessel_name": "7 Waves"
        //   },
        //   {
        //     "heading": "332.3",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "33.60322",
        //     "long": "-7.60688",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9728461",
        //     "vessel_name": "Fiora Topic"
        //   },
        //   {
        //     "heading": "24.0",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "5.52696",
        //     "long": "-25.99622",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9728473",
        //     "vessel_name": "Alberto Topic"
        //   },
        //   {
        //     "heading": "34.6",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "12.494020",
        //     "long": "176.295398",
        //     "position_source": "V-SAT 1",
        //     "update_state": 2,
        //     "vessel_id": "9737084",
        //     "vessel_name": "Sand Topic"
        //   },
        //   {
        //     "heading": "325.2",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "53.47284",
        //     "long": "0.63474",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9789233",
        //     "vessel_name": "Celine"
        //   },
        //   {
        //     "heading": "144.3",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "51.36146",
        //     "long": "3.19476",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9789245",
        //     "vessel_name": "Delphine"
        //   },
        //   {
        //     "heading": "57.9",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "-12.65589",
        //     "long": "110.13894",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9793234",
        //     "vessel_name": "Anderida"
        //   },
        //   {
        //     "heading": "107.1",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "30.01111",
        //     "long": "-93.99308",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9793246",
        //     "vessel_name": "Aisling"
        //   },
        //   {
        //     "heading": "347.8",
        //     "heading_source": "V-SAT 1",
        //     "isOpen": false,
        //     "lat": "-5.89815",
        //     "long": "-34.64592",
        //     "position_source": "MODEM 1",
        //     "update_state": 2,
        //     "vessel_id": "9793258",
        //     "vessel_name": "Mont Fort"
        //   }
        // ]});
      });
  };

  render() {
    return (
      <MyMapComponent
        vessels={this.state.vessels}
        toggleVesselInfo={this.toggleVesselInfo}
      />
    )
  }
}
export default MyFancyComponent;