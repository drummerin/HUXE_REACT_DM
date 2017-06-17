import React from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import EditButton from 'material-ui/svg-icons/image/edit';
import OKButton from 'material-ui/svg-icons/navigation/check';
import ImageButton from 'material-ui/svg-icons/image/image';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import ColorIcon from 'material-ui/svg-icons/image/color-lens';
import IconButton from 'material-ui/IconButton';
import { SketchPicker } from 'react-color';
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
  popover: {
    position: 'absolute',
    top: '20%',
    left: '50%',
    zIndex: '2',
  },
  cover: {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
};


@connect(store => ({
  project: store.project,
}))

/* Drawing Functions and Canvas Implementation (Modified)
 Copyright (c) 2017 Marcin Borkowski
 MIT License
 */

export default class Draw extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      DrawContent: '',
      editingDraw: false,
      isMouseDown: false,
      blur: true,
      lineThickness: 1,
      lineColor: '#555555',
      lineStyle: 'round',
      selectingColor: false,
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

  editDraw() {
    this.setState({ editingDraw: true });
  }

  finishEditing() {
    this.setState({ selectingColor: false, editingDraw: false, DrawContent: '', lineThickness: 1, lineColor: '#555555', blur: true });
  }

  deleteDraw() {
    firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.props.component.componentName}`).remove();
    this.updateProjectAction(this.props.project);
  }
  saveDraw() {
    const image = new Image();
    image.src = this.canvas.toDataURL('image/png');
    window.open(image.src);
  }

  componentDidMount() {
    if (self && (!this.canvas.getContext || !this.canvas.getBoundingClientRect)) {
      throw new Error('HTML5 Canvas is not supported in your browser.');
    }
    this.ctx = this.canvas.getContext('2d') || {};
    this.bcr = this.canvas.getBoundingClientRect() || {};

    // to set the background of the component white
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.fillRect(0, 0, 260, 240);
    this.ctx.closePath();

    const canvas = this.canvas;
    const context = canvas.getContext('2d');
    const imageObj = new Image();
    imageObj.onload = function () {
      context.drawImage(this, 0, 0);
    };

    imageObj.src = this.props.component.drawContent;

    this.setAppearance();
  }

  componentDidUpdate() {
    const canvas = this.canvas;
    const context = canvas.getContext('2d');
    const imageObj = new Image();
    imageObj.onload = function () {
      context.drawImage(this, 0, 0);
    };

    imageObj.src = this.props.component.drawContent;
  }

  hashTable = {};
  rawData = [];

  setAppearance() {
    this.ctx.lineWidth = this.state.lineThickness;
    this.ctx.strokeStyle = this.state.lineColor;
    this.ctx.lineJoin = this.state.lineStyle;

    if (this.state.blur) {
      this.ctx.shadowBlur = 1;
      this.ctx.shadowColor = this.state.lineColor;
    } else {
      this.ctx.shadowBlur = 0;
      this.ctx.shadowColor = 0;
    }
  }

  onMouseDown = (event) => {
    this.setAppearance();
    this.setState({
      isMouseDown: true,
    });

    this.ctx.beginPath();

    this.ctx.moveTo(
            (event.pageX || event.touches[0].pageX) - this.bcr.left,
            (event.pageY || event.touches[0].pageY) - this.bcr.top,
        );
  };

  onMouseUp = () => {
    if (this.state.isMouseDown) {
      this.setState({
        isMouseDown: false,
      });

      this.ctx.closePath();
      this.hashTable = {};

            // remove duplicates
      this.rawData = this.rawData.filter((element) => {
        const key = JSON.stringify(element);
        const match = Boolean(this.hashTable[key]);

        return (match ? false : (this.hashTable[key] = true));
      });

      const image = new Image();
      image.src = this.canvas.toDataURL('image/png');

      firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.props.component.componentName}`).set({
        componentName: this.props.component.componentName,
        componentType: this.props.component.componentType,
        drawContent: image.src });
      this.updateProjectAction(this.props.project);
    }
  };

  onMouseMove = (event) => {
    if (this.state.isMouseDown) {
      event.preventDefault();

      const coordinates = [
        event.pageX || event.touches[0].pageX,
        event.pageY || event.touches[0].pageY,
      ];
      this.rawData.push(coordinates);
      this.drawOnCanvas(coordinates);
    }
  };

  drawOnCanvas = (coordinates) => {
    const [
            left,
            top,
        ] = coordinates;
    this.ctx.lineTo(
            left - this.bcr.left,
            top - this.bcr.top,
        );
    this.ctx.stroke();
  };

  erase = () => {
    this.setState({ lineThickness: 10, lineColor: '#ffffff', blur: false });
  };

  changeColor= () => {
    this.setState({ selectingColor: true,
      lineColor: this.state.selectedColor,
      lineThickness: 1,
      blur: true });
  };
  static componentToHex(c) {
    const hex = c.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  }
  static rgbToHex(color) {
    return `#${Draw.componentToHex(color.rgb.r)}${Draw.componentToHex(color.rgb.g)}${Draw.componentToHex(color.rgb.b)}`;
  }

  handleColorChange = (color) => {
    this.setState({ selectedColor: Draw.rgbToHex(color), lineColor: Draw.rgbToHex(color) });
  };

  handleClose = () => {
    this.setState({ selectingColor: false });
  };

  render() {
    return <div>
        <Paper style={styles.paper}><div style={styles.paperHeader}>
            {this.props.component.componentName}
            <IconButton onTouchTap={() => this.deleteDraw()} style={styles.button}>
                <DeleteIcon color='#DDDDDD'
                            hoverColor={this.props.project.projectColor} /> </IconButton>
                <IconButton onTouchTap={() => this.saveDraw()} style={styles.button}>
                  <ImageButton color='#DDDDDD'
                              hoverColor={this.props.project.projectColor} /> </IconButton>
            {(this.state.editingDraw) ?
                <IconButton onTouchTap={() => this.finishEditing()} style={styles.button}>
                  <OKButton color='#DDDDDD'
                            hoverColor={this.props.project.projectColor} /> </IconButton> :
                <IconButton onTouchTap={() => this.editDraw()} style={styles.button}>
                  <EditButton color='#DDDDDD'
                              hoverColor={this.props.project.projectColor} /></IconButton>}
        <div className="cursor">
            <canvas
                ref={canvas => (this.canvas = canvas)}
                height='240px'
                width='260px'
                onMouseDown={this.onMouseDown}
                onTouchStart={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                onTouchEnd={this.onMouseUp}
                onMouseMove={this.onMouseMove}
                onMouseOut={this.onMouseUp} />
          </div></div>
        </Paper>
        {(this.state.editingDraw) ?
        <Paper style={styles.paperMenu}><div style={styles.paperHeader}>
          <IconButton onTouchTap={() => this.finishEditing()} style={styles.button}>
            <EditButton color={this.props.project.projectColor}/></IconButton><br/>
          <IconButton onTouchTap={() => this.erase()} style={styles.editDrawButton} tooltip="erase"
                      tooltipPosition="top-right">
            <DeleteIcon color='#DDDDDD'
                        hoverColor={this.props.project.projectColor} /> </IconButton>
          <IconButton onTouchTap={() => this.changeColor()} style={styles.editDrawButton}>
            <ColorIcon color={this.state.selectedColor}
                         hoverColor={this.props.project.projectColor} /> </IconButton></div>
        </Paper> :
          <div></div>
         }
        { this.state.selectingColor ? <div style={ styles.popover }>
              <div style={ styles.cover } onClick={ this.handleClose }/>
              <SketchPicker color={ this.state.selectedColor }
                            onChange={ this.handleColorChange } />
            </div> : null }</div>;
  }

}

