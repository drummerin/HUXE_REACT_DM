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
    padding: '0 20px 0 10px',
    height: '170px',
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
    padding: '10px 0px 10px 50px',
    width: '180px',
  },
  input: {
    marginTop: '-20px',
    width: '225px',
  },
  inputTodo: {
    width: '180px',
    height: '40px',
    marginTop: 0,
  },
  deleteButton: {
    padding: '0 10px 0 0',
    width: '25px',
    height: '25px',
    float: 'right',
  },
  button: {
    padding: '10px 10px 0px 0px',
    width: '25px',
    height: '25px',
    float: 'right',
  },
  editButton: {
    marginRight: '-45px',
  },

};

@connect(store => ({
  project: store.project,
}))


export default class Todo extends React.Component {
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
    this.setState({ [event.target.id]: event.target.value });
  }

  addTodoItem() {
    if (this.state.newTodo !== '') {
      firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.props.component.componentName}/todos/${(this.state.newTodo).substring(0, 3) + this.state.todoId}`).set({
        todo: this.state.newTodo,
        checked: false,
        id: (this.state.newTodo).substring(0, 3) + this.state.todoId });
      const Id = +1;
      this.setState({ newTodo: '', editTodo: '', todoId: Id });
      this.updateProjectAction(this.props.project);
    }
  }

  updateProjectAction(project) {
    this.props.dispatch(updateProjectAction(project));
  }

  editTodo(todo) {
    this.setState({ editingTodo: todo.id, editTodo: todo.todo });
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
    this.updateProjectAction(this.props.project);
  }

  deleteTodoList() {
    firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.props.component.componentName}`).remove();
    this.updateProjectAction(this.props.project);
  }

  render() {
    let todoList;
    if (this.props.component.todos != null) {
      const todoarray = Object.keys(this.props.component.todos).map(key =>
          this.props.component.todos[key]);
      todoList = todoarray.map((todo, i) => (
          <ListItem key={i}
                    style={styles.listItem}
                    primaryText={(this.state.editingTodo === todo.id) ?
                        <InputField style={styles.inputTodo}
                                   inputStyle={{ height: '20px' }}
                                   hintText="if empty, delete!"
                                   id="editTodo"
                                   value={this.state.editTodo}
                                   onChange={this.handleChange}/> :
                        <span>{todo.todo}</span>}
                    rightIconButton={
                        (this.state.editingTodo !== todo.id) ?
                        <IconButton onTouchTap={() => this.editTodo(todo)}
                                    style={styles.editButton}>
                        <EditButton color='#DDDDDD'
                                    hoverColor={this.props.project.projectColor}/></IconButton> :
                        <IconButton onTouchTap={() => this.finishEditing(todo)}
                                    style={styles.editButton}>
                        <OKButton color='#DDDDDD'
                                  hoverColor={this.props.project.projectColor} /> </IconButton>}

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
            {this.props.component.componentName}
            <IconButton onTouchTap={() => this.deleteTodoList()} style={styles.deleteButton}>
                <DeleteIcon color='#DDDDDD'
                            hoverColor={this.props.project.projectColor} /> </IconButton>
            <hr/></div>
          <div style={styles.paperMiddle}><List>
                {todoList}
          </List></div>
            <div style={styles.paperBottom}><hr/>
            <InputField style={styles.input}
                       floatingLabelText="add todo"
                       id="newTodo"
                       value={this.state.newTodo}
                       onChange={this.handleChange}/>
              <IconButton style={styles.button} onTouchTap={() => this.addTodoItem()}>
                <OKButton color='#DDDDDD'
                          hoverColor={this.props.project.projectColor}/></IconButton>
            </div>
        </Paper>
      </div>;
  }


}

