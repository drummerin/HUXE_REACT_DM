import React from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import projects from '../projects';
import Todo from '../components/Todo';

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
    this.handleChange = this.handleChange.bind(this);
    this.buildProjectList = this.buildProjectList.bind(this);
  }
  componentWillMount() {
    // firebase.database().ref('value').on('value', this.buildProjectList);
    // console.log('component mounts');;
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

  handleChange(event) {
    this.setState({ value: event.target.value });
  }


  render() {
    return <div>
                <Todo project={this.props.project} name="Test"/>

        </div>;
  }

}
