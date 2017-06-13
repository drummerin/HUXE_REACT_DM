import React from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import InputField from 'material-ui/TextField';
import { List, ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import OKButton from 'material-ui/svg-icons/navigation/check';
import IconButton from 'material-ui/IconButton';

import projects from '../projects';

const styles = {
  paper: {
    margin: '5px',
    width: '300px',
    height: '300px',
    float: 'left',
    overflow: 'auto',
  },
  paperHeader: {
    padding: '20px 20px 0 20px',
    textAlign: 'center',
  },
  paperBottom: {
    padding: '0 20px 20px 20px',
  },
  checkbox: {
    top: '6px',
  },
  listItem: {
    padding: '10px 10px 10px 55px',
  },
  input: {
    marginTop: '-20px',
    width: '195px',
  },

};

@connect(store => ({
  project: store.project,
  component: store.component,
}))


export default class Projects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoTitle: '',
      todoList: [],
      todo: '',
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
    component: PropTypes.string,
  };

  handleChange(event) {
    console.log(`input: ${event.target.value}`);
    this.setState({ todo: event.target.value });
  }

  addTodoItem() {
    firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.props.component}/content`).push({
      todo: this.state.todo,
      checked: false });
  }

  onCheckHandler(event, checked) {
    console.log(checked);
  }


  render() {
    return <div>
        <Paper style={styles.paper}><div style={styles.paperHeader}>To-do List<hr/></div>
            <List>
                <ListItem style={styles.listItem}
                    leftCheckbox={<Checkbox style={styles.checkbox} onCheck={this.onCheckHandler}/>}
                    primaryText="Notifications"
                    secondaryText="Allow notifications"
                />
                <ListItem style={styles.listItem}
                    leftCheckbox={<Checkbox style={styles.checkbox}/>}
                    primaryText="Sounds"
                />
                <ListItem style={styles.listItem}
                    leftCheckbox={<Checkbox style={styles.checkbox}/>}
                    primaryText="Video sounds"
                    secondaryText="Hangouts video call"
                />
            </List>
            <div style={styles.paperBottom}><hr/>
            <InputField style={styles.input}
                       floatingLabelText="add todo"
                       id="todo"
                       multiLine={true}
                       value={this.state.todo}
                       onChange={this.handleChange}/>
              <IconButton style={styles.Okbutton} onTouchTap={() => this.addTodoItem()}>
                <OKButton /></IconButton>
            </div>
        </Paper>
      </div>;
  }

}

