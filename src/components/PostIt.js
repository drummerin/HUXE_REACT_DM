import React from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import InputField from 'material-ui/TextField';
import EditButton from 'material-ui/svg-icons/image/edit';
import OKButton from 'material-ui/svg-icons/navigation/check';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import IconButton from 'material-ui/IconButton';
import { updateProject as updateProjectAction } from '../actions';

const styles = {
  paper: {
    margin: '10px',
    width: '300px',
    height: '300px',
    float: 'left',
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

};

@connect(store => ({
  project: store.project,
}))


export default class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      postItContent: '',
      editingPostIt: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }


  static propTypes = {
    project: PropTypes.object,
    dispatch: PropTypes.func,
    component: PropTypes.object,
  };

  handleChange(event) {
    console.log(`input: ${event.target.value}`);
    this.setState({ [event.target.id]: event.target.value });
  }

  updateProjectAction(project) {
    this.props.dispatch(updateProjectAction(project));
  }

  editPostIt() {
    this.setState({ editingPostIt: true, postItContent: this.props.component.postItText });
  }

  finishEditing() {
    firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.props.component.componentName}`).set({
      componentName: this.props.component.componentName,
      componentType: this.props.component.componentType,
      postItText: this.state.postItContent });
    this.setState({ editingPostIt: false, postItContent: '' });
    this.updateProjectAction(this.props.project);
  }

  deletePostIt() {
    firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.props.component.componentName}`).remove();
    this.updateProjectAction(this.props.project);
  }

  render() {
    console.log(this.props.component.postItText);
    return <div>
        <Paper style={styles.paper}><div style={styles.paperHeader}>
            {this.props.component.componentName}
            <IconButton onTouchTap={() => this.deletePostIt()} style={styles.button}>
                <DeleteIcon color='#DDDDDD'
                            hoverColor={this.props.project.projectColor} /> </IconButton>
            {(this.state.editingPostIt) ?
          <IconButton onTouchTap={() => this.finishEditing()} style={styles.button}>
            <OKButton color='#DDDDDD'
                      hoverColor={this.props.project.projectColor} /> </IconButton> :
          <IconButton onTouchTap={() => this.editPostIt()} style={styles.button}>
            <EditButton color='#DDDDDD'
                        hoverColor={this.props.project.projectColor} /></IconButton>}
            <hr/></div>
          <div style={styles.paperMiddle}>
                {(this.state.editingPostIt) ?
            <InputField id="postItContent"
                        value={this.state.postItContent}
                        multiLine={true}
                        onChange={this.handleChange}/> :
                    <span>{this.props.component.postItText}</span>}
            </div>
        </Paper>
      </div>;
  }


}

