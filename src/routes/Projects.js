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
import { updateProject as updateProjectAction } from '../actions';
import Component from '../components/Component';

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
  <MenuItem key={1} value={'Todo'} primaryText="Todo" />,
  <MenuItem key={2} value={'PostIt'} primaryText="PostIt" />,
  <MenuItem key={3} value={'Draw'} primaryText="Draw" />,
  <MenuItem key={4} value={'MapComp'} primaryText="Map" />,
  <MenuItem key={5} value={'Chat'} primaryText="Chat" />,
];

const fireCheck = /^[a-zA-Z0-9]*$/;

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
        componentAlreadyExists: true,
        selectedComponent: '',
      },
    };
    this.handleChange = this.handleChange.bind(this);
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
    if (!isNaN(this.props.project.components)) {
      for (let i = 0, comp = this.props.project.components; i < comp.length; i += 1) {
        if (comp[i].componentName === newValue) {
          this.setState({
            newComponentDialog: {
              ...this.state.newComponentDialog,
              [event.target.id]: event.target.value,
              componentAlreadyExists: true,
              errorTextComponentName: 'this component already exists!',
            },
          });
        }
      }
    } else if (newValue === '') {
      this.setState({
        newComponentDialog: {
          ...this.state.newComponentDialog,
          [event.target.id]: event.target.value,
          componentAlreadyExists: true,
          errorTextComponentName: 'this field is required!',
        },
      });
    } else if (event.target.id === 'componentName' && !fireCheck.test(newValue)) {
      this.setState({
        newComponentDialog: {
          ...this.state.newComponentDialog,
          [event.target.id]: event.target.value,
          componentAlreadyExists: true,
          errorTextComponentName: 'empty spaces or special characters are not allowed!',
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


  static propTypes = {
    project: PropTypes.object,
    dispatch: PropTypes.func,
  };

  addComponent() {
    if (this.state.newComponentDialog.selectedComponent === 'Todo') {
      firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.state.newComponentDialog.componentName}`).set({
        componentName: this.state.newComponentDialog.componentName,
        componentType: this.state.newComponentDialog.selectedComponent,
        todos: '' });
    } else if (this.state.newComponentDialog.selectedComponent === 'PostIt') {
      firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.state.newComponentDialog.componentName}`).set({
        componentName: this.state.newComponentDialog.componentName,
        componentType: this.state.newComponentDialog.selectedComponent,
        postItText: '' });
    } else if (this.state.newComponentDialog.selectedComponent === 'Draw') {
      firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.state.newComponentDialog.componentName}`).set({
        componentName: this.state.newComponentDialog.componentName,
        componentType: this.state.newComponentDialog.selectedComponent,
        drawable: '' });
    } else if (this.state.newComponentDialog.selectedComponent === 'MapComp') {
      firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.state.newComponentDialog.componentName}`).set({
        componentName: this.state.newComponentDialog.componentName,
        componentType: this.state.newComponentDialog.selectedComponent,
        mapCenterX: 48.3667,
        mapCenterY: 14.516,
        mapZoom: 14,
        markers: '' });
    } else if (this.state.newComponentDialog.selectedComponent === 'Chat') {
      firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.state.newComponentDialog.componentName}`).set({
        componentName: this.state.newComponentDialog.componentName,
        componentType: this.state.newComponentDialog.selectedComponent,
        chatContent: '' });
    }


    this.setState({ newComponentDialog: {
      componentName: '',
      selectedComponent: '',
    },
    });
    this.updateProjectAction(this.props.project);
  }

  updateProjectAction(project) {
    this.props.dispatch(updateProjectAction(project));
  }


  render() {
    let actions;
    if (this.state.newComponentDialog.componentAlreadyExists || this.state.newComponentDialog.selectedComponent === '') {
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
                  onTouchTap={() => {
                    this.addComponent();
                    this.handleCloseDialog();
                  }}
              />,
      ];
    }

    let components;
    if (this.props.project.components != null) {
      components = this.props.project.components.map((Comp, i) => (
          <Component key={i}
                project={this.props.project}
                component={Comp}
                name={Comp.componentName}/>
      ));
    }

    return <div>
        {components}
      <div><FloatingActionButton mini={true} style={styles.addButton}
                                 backgroundColor={this.props.project.projectColor}
                                 onTouchTap={() => this.handleOpenDialog()}>
        <ContentAdd />
      </FloatingActionButton></div>
      <div>
        <Dialog contentStyle={{ width: '400px' }}
            title="Create a new project component"
            actions={actions}
            modal={false}
            open={this.state.dialogOpen}
            onRequestClose={this.handleCloseDialog}>
          <Table height='210px'
                 selectable={false}><TableBody
              displayRowCheckbox={false}><TableRow displayBorder={false}>
            <TableRowColumn>
                <SelectField
                    floatingLabelText="Component type"
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
