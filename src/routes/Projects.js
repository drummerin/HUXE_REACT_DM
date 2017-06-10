
import React from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import ActionNew from 'material-ui/svg-icons/file/create-new-folder';
import OKButton from 'material-ui/svg-icons/navigation/check';
import Paper from 'material-ui/Paper';
import projects from '../projects';
import { setProject as setProjectAction } from '../actions';

const styles = {
  container: {
    padding: 10,
    width: 800,
  },
  radioButton: {
    padding: 10,
  },
  addNewProjectButton: {
    textTransform: 'none',
    fontFamily: 'Roboto, sans-serif',
    fontSize: 16,
  },
  newProject: {
    display: 'inline-block',
  },
};

@connect(store => ({
  project: store.project,
}))


export default class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputActive: false,
      value: '',
      projectList: [],
    };


    // this.onButtonClick = this.onButtonClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.buildProjectList = this.buildProjectList.bind(this);
    // this.componentWillMount = this.componentWillMount.bind(this);
  }
  componentWillMount() {
    // const query = firebase.database().ref('value').orderByKey();
    firebase.database().ref('value').on('value', this.buildProjectList);
    console.log('component mounts');
    // query.on('value', this.buildProjectList);
  }

  buildProjectList(dataSnapshot) {
    dataSnapshot.forEach((childSnapshot) => {
              // childData will be the actual contents of the child
      const childData = childSnapshot.val();
      console.log(`childData ${childData}`);
      if (this.state.projectList.indexOf(childData) === -1) {
        console.log('not contained');
        // wieso fuegst du die der Datei hinzu?
        projects.push({
          name: childData,
          color: '#D80926',
          dark: false,
        });
        this.state.projectList.push(childData);
        // ... ?
      }
    });

    console.log(`projectList ${this.state.projectList}`);
    this.setState(this.state);
  }

  static propTypes = {
    project: PropTypes.object,
    dispatch: PropTypes.func,
  };

  setProject(name) {
    const project = projects.find(loopProject => loopProject.name === name);
    if (project) {
      this.props.dispatch(setProjectAction(project));
    }
  }

  onButtonClick() {
    if (!this.state.inputActive) {
      this.setState({
        inputActive: true,
      });
    } else {
      this.setState({
        inputActive: false,
      });
    }
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  addProject() {
    /* projects.push({
      name: this.state.value,
      color: '#D80926',
      dark: false,
    });*/
    // console.log(this.props.project);
    // console.log(projects.length);
    firebase.database().ref('value').push(this.state.value);
    // this.buildProjectList();
    this.setState({ value: '' });
  }

  render() {
    return <div>
            <h1>{this.constructor.name}</h1>
            <h2>{this.props.project.projectName}</h2>
            <Paper style={styles.container}>
                <RadioButtonGroup name="projects" valueSelected={this.props.project.name}
                                  onChange={(e, value) => this.setProject(value)}>

                    { this.state.projectList.map(project => <RadioButton value={project}
                                                          label={project}
                                                           key={project}
                                                          style={styles.radioButton}/>)}
                </RadioButtonGroup>
                <FlatButton onTouchTap={() => this.onButtonClick()}
                            icon={<ActionNew/>}
                            label="&nbsp; New Project"
                            labelStyle={styles.addNewProjectButton}
                />
                {this.state.inputActive ? <div style={styles.newProject}>
                        <input type="text"
                        placeholder="Enter project name"
                        value={this.state.value}
                        style={styles.flatButton}
                        onChange={this.handleChange}
                        />
                        <FlatButton onTouchTap={() => this.addProject()}
                                    style={styles.flatButton}
                                    icon={<OKButton/>}>
                    </FlatButton></div> : <p></p>}

            </Paper>
        </div>;
  }

}
