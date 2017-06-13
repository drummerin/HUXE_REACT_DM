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
import { updateProject as updateProjectAction } from '../actions';
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
  }


  static propTypes = {
    project: PropTypes.object,
    dispatch: PropTypes.func,
    component: PropTypes.object,
  };

  handleChange(event) {
    console.log(`input: ${event.target.value}`);
    this.setState({ todo: event.target.value });
  }

  addTodoItem() {
    firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.props.component.componentName}/todos`).push({
      todo: this.state.todo,
      checked: false });
    this.setState({ todo: '' });
    this.updateProjectAction(this.props.project);
  }

  updateProjectAction(project) {
    this.props.dispatch(updateProjectAction(project));
  }

  onCheckHandler(event, checked) {
    console.log(checked);
  }


  render() {
    console.log(this.props.component.todos);
    let todoList;
    if (this.props.component.todos != null) {
      const todoarray = Object.keys(this.props.component.todos).map(key =>
          this.props.component.todos[key]);
      console.log(todoarray);
      todoList = todoarray.map((todo, i) => (
          <ListItem key={i}
                    style={styles.listItem}
                    leftCheckbox={<Checkbox style={styles.checkbox} onCheck={this.onCheckHandler}/>}
                    primaryText={todo.todo}
          />
      ));

      console.log(todoList);
      console.log(this.props.component);
    }

    return <div>
        <Paper style={styles.paper}><div style={styles.paperHeader}>
            {this.props.component.componentName}<hr/></div>
            <List>
                {todoList}
                <ListItem style={styles.listItem}
                    leftCheckbox={<Checkbox style={styles.checkbox} onCheck={this.onCheckHandler}/>}
                    primaryText="Notifications"
                    secondaryText="Allow notifications"
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

