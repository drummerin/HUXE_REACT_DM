import React from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import InputField from 'material-ui/TextField';
import { List, ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import EditButton from 'material-ui/svg-icons/image/edit';
import OKButton from 'material-ui/svg-icons/navigation/check';
import IconButton from 'material-ui/IconButton';
import { updateProject as updateProjectAction } from '../actions';

const styles = {
  paper: {
    margin: '5px',
    width: '300px',
    height: '300px',
    float: 'left',
  },
  paperHeader: {
    top: '0',
    padding: '20px 20px 0 20px',
    textAlign: 'center',
  },
  paperMiddle: {
    padding: '0 20px 0 20px',
    height: '160px',
    overflow: 'auto',
  },
  paperBottom: {
    padding: '0 20px 20px 20px',
    height: '50px',
  },
  checkbox: {
    top: '6px',
  },
  listItem: {
    padding: '10px 10px 10px 55px',
  },
  input: {
    marginTop: '-20px',
    width: '196px',
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
      newTodo: '',
      editTodo: '',
      todoId: 0,
      editingTodo: '',
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

  addTodoItem() {
    if (this.state.newTodo !== '') {
      firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.props.component.componentName}/todos/${this.state.newTodo + this.state.todoId}`).set({
        todo: this.state.newTodo,
        checked: false,
        id: this.state.newTodo + this.state.todoId });
      const Id = +1;
      this.setState({ newTodo: '', todoId: Id });
      this.updateProjectAction(this.props.project);
    }
  }

  updateProjectAction(project) {
    this.props.dispatch(updateProjectAction(project));
  }

  editTodo(todo, Id) {
    this.setState({ editingTodo: todo });
  }

  finishEditing(todo) {
    if (this.state.editTodo !== '') {
      firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.props.component.componentName}/todos/${todo.id}`).set({
        todo: this.state.editTodo,
        checked: todo.checked,
        id: todo.id });
    } else {
      firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.props.component.componentName}/todos/${todo.id}`).remove();
    }
    this.setState({ editingTodo: '', newTodo: '', editTodo: '' });
    this.updateProjectAction(this.props.project);
  }

  handleCheck(id, checked) {
    firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.props.component.componentName}/todos/${id.id}`).set({
      todo: id.todo,
      checked: !checked,
      id: id.id });
    console.log(`id: ${id.todo + id.id}`);
    console.log(`checked: ${checked}`);
    this.updateProjectAction(this.props.project);
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
                    primaryText={(this.state.editingTodo === todo.todo) ?
                        <InputField style={styles.input}
                                   floatingLabelText="edit todo"
                                   id="editTodo"
                                   value={this.state.editTodo}
                                   onChange={this.handleChange}/> :
                        <span>{todo.todo}</span>}
                    rightIconButton={
                        (this.state.editingTodo !== todo.todo) ?
                        <IconButton onTouchTap={() => this.editTodo(todo.todo, todo.todoId)}>
                        <EditButton color={this.props.project.projectColor } /></IconButton> :
                        <IconButton onTouchTap={() => this.finishEditing(todo)}>
                        <OKButton color={this.props.project.projectColor } /> </IconButton>}

                    leftCheckbox={
                        <Checkbox style={styles.checkbox} key={todo.todo}
                                  value={todo.checked}
                                  checked={todo.checked}
                                  onCheck={() => {
                                    this.handleCheck(todo, todo.checked);
                                    this.updateProjectAction(this.props.project);
                                  }}/>}
          />
      ));
    }

    return <div>
        <Paper style={styles.paper}><div style={styles.paperHeader}>
            {this.props.component.componentName}<hr/></div>
          <div style={styles.paperMiddle}><List>
                {todoList}
          </List></div>
            <div style={styles.paperBottom}><hr/>
            <InputField style={styles.input}
                       floatingLabelText="add todo"
                       id="newTodo"
                       value={this.state.newTodo}
                       onChange={this.handleChange}/>
              <IconButton style={styles.Okbutton} onTouchTap={() => this.addTodoItem()}>
                <OKButton /></IconButton>
            </div>
        </Paper>
      </div>;
  }


}

