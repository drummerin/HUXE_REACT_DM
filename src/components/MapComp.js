import React from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import AddMarkerIcon from 'material-ui/svg-icons/maps/add-location';
import EditMarkerIcon from 'material-ui/svg-icons/maps/edit-location';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import InputField from 'material-ui/TextField';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { updateProject as updateProjectAction } from '../actions';

const styles = {
  paper: {
    margin: '10px',
    width: '300px',
    height: '300px',
    float: 'left',
  },
  paperMenu: {
    margin: '10px',
    padding: '0 15px 15px 15px',
    width: '45px',
    height: '150px',
    float: 'left',
    borderRadius: '20px',
  },
  paperHeader: {
    padding: '15px 20px 0 20px',
    textAlign: 'center',
  },
  paperMiddle: {
    margin: '15px 20px 0px 20px',
    height: '230px',
    overflow: 'auto',
  },
  button: {
    padding: '0 10px 0 0',
    width: '25px',
    height: '25px',
    float: 'right',
  },
  editDrawButton: {
    padding: '0',
    marginTop: '15px',
    width: '25px',
    height: '25px',
    float: 'right',
  },
};

const fireCheck = /^[a-zA-Z0-9]*$/;

@connect(store => ({
  project: store.project,
}))

export default class MapComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 48.3667,
      lng: 14.5167,
      pos: '',
      zoom: '',
      markerName: '',
      markerDescription: '',
      dialogOpen: false,
      markerAlreadyExists: true,
      errorText: 'This field is required!',
      markers: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }


  static propTypes = {
    project: PropTypes.object,
    dispatch: PropTypes.func,
    component: PropTypes.object,
  };

  componentDidMount() {
    this.setState({ markers: this.props.component.markers });
    const leafletMap = this.leafletMap.leafletElement;
    leafletMap.on('zoomend', () => {
      const updatedZoomLevel = leafletMap.getZoom();
      this.handleZoomLevelChange(updatedZoomLevel);
    });
    leafletMap.on('move', () => {
      const updatedPos = leafletMap.getCenter();
      this.handlePositionChange(updatedPos);
    });
  }
  componentWillUnmount() {
    console.log(this.state.lat + this.state.lng);
    if (this.state.zoom !== '') {
      firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.props.component.componentName}`).set({
        componentName: this.props.component.componentName,
        componentType: this.props.component.componentType,
        mapCenterX: this.state.lat,
        mapCenterY: this.state.lng,
        mapZoom: this.state.zoom,
        markers: this.state.markers,
      });
    }
  }

  handleZoomLevelChange(newZoomLevel) {
    this.setState({ zoom: newZoomLevel });
  }
  handlePositionChange(newPosition) {
    this.setState({ lat: newPosition.lat, lng: newPosition.lng });
  }

  handleChange = (event, newValue) => {
    this.setState({
      ...this.state,
      [event.target.id]: newValue,
      markerAlreadyExists: false,
      errorText: '',
    });
    if (this.state.markers !== undefined) {
      for (let i = 0, mark = this.state.markers; i < mark.length; i += 1) {
        if (mark[i].markerName === newValue) {
          this.setState({
            ...this.state,
            [event.target.id]: event.target.value,
            markerAlreadyExists: true,
            errorText: 'this marker already exists!',
          });
        }
      }
    }
    if (event.target.id === 'markerName' && newValue === '') {
      this.setState({
        ...this.state,
        [event.target.id]: newValue,
        markerAlreadyExists: true,
        errorText: 'this field is required!',

      });
    } else if (event.target.id === 'markerName' && !fireCheck.test(newValue)) {
      this.setState({
        ...this.state,
        [event.target.id]: event.target.value,
        markerAlreadyExists: true,
        errorText: 'empty spaces or special characters are not allowed!',
      });
    }
    if (this.state.markerName === '') {
      this.setState({
        ...this.state,
        [event.target.id]: event.target.value,
        markerAlreadyExists: true,
        errorText: 'This field is required!',

      });
    }
  };

  updateProjectAction(project) {
    this.props.dispatch(updateProjectAction(project));
  }


  addMarker() {
    firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.props.component.componentName}/markers/${this.state.markerName}`).set({
      lat: this.state.lat,
      lng: this.state.lng,
      markerName: this.state.markerName,
      markerDescription: this.state.markerDescription,
    });
    this.setState({ markerName: '', markerDescription: '' });
    this.updateProjectAction(this.props.project);
  }
  handleOpenDialog() {
    this.setState({ dialogOpen: true });
  }

  handleCloseDialog = () => {
    this.setState({ dialogOpen: false });
  };

  deleteMap() {
    firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.props.component.componentName}`).remove();
    this.updateProjectAction(this.props.project);
  }

  render() {
    let actions;
    if (this.state.markerAlreadyExists) {
      actions = [
        <FlatButton
                  label="Cancel"
                  primary={true}
                  onTouchTap={this.handleCloseDialog}
              />, <FlatButton
                  label="Add Marker"
                  disabled={true}
                  primary={true}
                  keyboardFocused={true}
              />,
      ];
    } else {
      actions = [
        <FlatButton
                  label="Cancel"
                  primary={true}
                  onTouchTap={this.handleCloseDialog}
              />, <FlatButton
                  label="Add Marker"
                  primary={true}
                  keyboardFocused={true}
                  onTouchTap={() => {
                    this.addMarker();
                    this.handleCloseDialog();
                  }}
              />,
      ];
    }
    let markerList;
    if (this.props.component.markers != null) {
      const markerArray = Object.keys(this.props.component.markers).map(key =>
              this.props.component.markers[key]);
      markerList = markerArray.map(Mark => (
              <Marker position={[Mark.lat, Mark.lng]} key={Mark.markerName}>
                  <Popup>
                    <span>{Mark.markerName}<hr/><br />{Mark.markerDescription}
                    </span>
                  </Popup>
              </Marker>
          ));
    }

    return <div>
        <Paper style={styles.paper}><div style={styles.paperHeader}>
            {this.props.component.componentName}
            <IconButton onTouchTap={() => this.deleteMap()} style={styles.button}>
                <DeleteIcon color='#DDDDDD'
                            hoverColor={this.props.project.projectColor} /> </IconButton>
            <IconButton onTouchTap={() => this.handleOpenDialog()} style={styles.button}>
              <AddMarkerIcon color='#DDDDDD'
                          hoverColor={this.props.project.projectColor} /> </IconButton>
          </div><div style={styles.paperMiddle}>
            <Map
                ref={(m) => { this.leafletMap = m; }}
                center={[this.props.component.mapCenterX, this.props.component.mapCenterY]}
                zoom={this.props.component.mapZoom}>
                <TileLayer
                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                />
                {markerList}
            </Map></div>
        </Paper>
        <Dialog contentStyle={{ width: '400px' }}
                title="Add a new marker to the center of the map."
                actions={actions}
                modal={false}
                open={this.state.dialogOpen}
                onRequestClose={this.handleCloseDialog}>
            <InputField
                hintText="Insert the marker's name."
                value={this.state.markerName}
                id="markerName"
                floatingLabelText="Marker name"
                onChange={this.handleChange}
                errorText={this.state.errorText}/>
            <InputField
                hintText="Description of the marker."
                value={this.state.markerDescription}
                multiLine={true}
                rows={1}
                rowsMax={2}
                id="markerDescription"
                floatingLabelText="Marker description"
                onChange={this.handleChange}/>
        </Dialog>
    </div>;
  }
}

