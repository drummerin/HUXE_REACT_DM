import React from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import InputField from 'material-ui/TextField';
import ContentAdd from 'material-ui/svg-icons/content/add';
import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import Dialog from 'material-ui/Dialog';

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
  Okbutton: {
    top: '35px',
    padding: '0',
  },
  addButton: {
    margin: '140px',
  },
};

const items = [
  <MenuItem key={1} value={'TODO'} primaryText="TODO" />,
  <MenuItem key={2} value={'List'} primaryText="List" />,
  <MenuItem key={3} value={3} primaryText="Weeknights" />,
  <MenuItem key={4} value={4} primaryText="Weekends" />,
  <MenuItem key={5} value={5} primaryText="Weekly" />,
];

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
      dialogOpen: false,
      newComponentDialog: {
        componentName: '',
        errorTextComponent: 'This field is required!',
        errorTextComponentName: 'This field is required!',
        componentAlreadyExists: false,
        selectedComponent: '',
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.buildProjectList = this.buildProjectList.bind(this);
  }
  componentWillMount() {
    // firebase.database().ref('value').on('value', this.buildProjectList);
    // console.log('component mounts');;
  }

  handleOpenDialog = () => {
    this.setState({ dialogOpen: true });
  };

  handleCloseDialog = () => {
    this.setState({ dialogOpen: false });
  };

  handleChange = (event, newValue) => {
    this.setState({
      newComponentDialog: {
        ...this.state.newComponentDialog,
        [event.target.id]: event.target.value,
        componentAlreadyExists: false,
        errorTextComponentName: '',
      },
    });
    projects.forEach((project) => {
      if (project.projectName === newValue) {
        console.log('jumps into checking TRUE');
        this.setState({
          newComponentDialog: {
            ...this.state.newComponentDialog,
            [event.target.id]: event.target.value,
            componentAlreadyExists: true,
            errorTextComponentName: 'this project already exists!',
          },
        });
      }
    });
    if (newValue === '') {
      this.setState({
        newComponentDialog: {
          ...this.state.newComponentDialog,
          [event.target.id]: event.target.value,
          componentAlreadyExists: true,
          errorTextComponentName: 'this field is required!',
        },
      });
    }
  };

  handleChangeComponent= (event, index, value) => {
    this.setState({
      newComponentDialog: {
        ...this.state.newComponentDialog,
        selectedComponent: value,
        errorTextComponent: '',
      },
    });
    if (value === '') {
      this.setState({
        newComponentDialog: {
          ...this.state.newComponentDialog,
          selectedComponent: value,
          errorTextComponent: 'this field is required!',
        },
      });
    }
  };

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

  addComponent() {
    firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.state.newComponentDialog.componentName}`).set({
      componentName: this.state.newComponentDialog.componentName,
      componentType: this.state.newComponentDialog.selectedComponent });

    this.setState({ newComponentDialog: {
      componentName: '',
      selectedComponent: '',
    },
    });
    console.log('add comp clicked');
  }


  render() {
    let actions;
    if (this.state.newComponentDialog.componentAlreadyExists) {
      actions = [
        <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleCloseDialog}
            />, <FlatButton
                label="Add"
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
                label="Add"
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => { this.addComponent(); this.handleCloseDialog(); }}
            />,
      ];
    }

    return <div>
                <Todo project={this.props.project} name="Test"/>
      <div><FloatingActionButton mini={true} style={styles.addButton}
                                 backgroundColor={this.props.project.projectColor}
                                 onTouchTap={() => this.handleOpenDialog()}>
        <ContentAdd />
      </FloatingActionButton></div>
      <div>
        <Dialog style={styles.dialog}
            title="Create a new TodoList"
            actions={actions}
            modal={false}
            open={this.state.dialogOpen}
            onRequestClose={this.handleCloseDialog}>
          <Table height='200px'
                 selectable={false}><TableBody
              displayRowCheckbox={false}><TableRow displayBorder={false}>
            <TableRowColumn>
                <SelectField
                    floatingLabelText="Component"
                    value={this.state.newComponentDialog.selectedComponent}
                    id="selectedComponent"
                    onChange={this.handleChangeComponent}
                    errorText={this.state.newComponentDialog.errorTextComponent}>{items}
                </SelectField>
            </TableRowColumn>
          </TableRow>
            <TableRow><TableRowColumn>
                <InputField
                    hintText="Enter the name of your component."
                    value={this.state.newComponentDialog.componentName}
                    id="componentName"
                    floatingLabelText="Component name"
                    onChange={this.handleChange}
                    errorText={this.state.newComponentDialog.errorTextComponentName}/>
            </TableRowColumn></TableRow></TableBody></Table>
        </Dialog>
      </div>


        </div>;
  }

}
