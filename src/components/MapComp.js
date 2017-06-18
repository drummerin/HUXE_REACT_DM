import React from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import ImageButton from 'material-ui/svg-icons/image/image';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';
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


@connect(store => ({
  project: store.project,
}))

export default class MapComp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 51.505,
      lng: -0.09,
      zoom: 13,
    };
    this.handleChange = this.handleChange.bind(this);
  }


  static propTypes = {
    project: PropTypes.object,
    dispatch: PropTypes.func,
    component: PropTypes.object,
  };

  handleChange(event) {
    this.setState({ [event.target.id]: event.target.value });
  }

  updateProjectAction(project) {
    this.props.dispatch(updateProjectAction(project));
  }


  deleteMap() {
    firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.props.component.componentName}`).remove();
    this.updateProjectAction(this.props.project);
  }

  handleClose = () => {
    this.setState({ selectingColor: false });
  };

  render() {
    const position = [this.state.lat, this.state.lng];
    return <div>
        <Paper style={styles.paper}><div style={styles.paperHeader}>
            {this.props.component.componentName}
            <IconButton onTouchTap={() => this.deleteMap()} style={styles.button}>
                <DeleteIcon color='#DDDDDD'
                            hoverColor={this.props.project.projectColor} /> </IconButton>
                <IconButton onTouchTap={() => this.saveDraw()} style={styles.button}>
                  <ImageButton color='#DDDDDD'
                              hoverColor={this.props.project.projectColor} /> </IconButton>

          </div><div style={styles.paperMiddle}>
            <Map center={position} zoom={this.state.zoom}>
                <TileLayer
                    attribution="&amp;copy <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
                    url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        <span>A pretty CSS3 popup. <br /> Easily customizable.</span>
                    </Popup>
                </Marker>
            </Map></div>
        </Paper>

                </div>;
  }

}

