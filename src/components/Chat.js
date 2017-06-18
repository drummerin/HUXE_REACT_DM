import React from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import PersonButton from 'material-ui/svg-icons/maps/person-pin';
import FlatButton from 'material-ui/FlatButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import Dialog from 'material-ui/Dialog';
import InputField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
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


export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Chatcontent: '',
      dialogOpen: false,
      userName: '',
      userNameAlreadyExists: true,
      errorText: 'this field is required!',
    };
    this.handleChange = this.handleChange.bind(this);
  }


  static propTypes = {
    project: PropTypes.object,
    dispatch: PropTypes.func,
    component: PropTypes.object,
  };

  handleChange = (event, newValue) => {
    this.setState({
      [event.target.id]: newValue,
      errorText: '',
      userNameAlreadyExists: false,
    });
    if (newValue === '') {
      this.setState({
        ...this.state.userName,
        userNameAlreadyExists: true,
        errorText: 'this field is required!',
      });
    }
  };

  handleOpenDialog = () => {
    this.setState({ dialogOpen: true });
  };

  handleCloseDialog = () => {
    this.setState({ dialogOpen: false });
  };

  updateProjectAction(project) {
    this.props.dispatch(updateProjectAction(project));
  }

  deleteChat() {
    firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.props.component.componentName}`).remove();
    this.updateProjectAction(this.props.project);
  }

  doChatStuff = () => {
      // do start chat stuff here
  };

  render() {
    console.log(this.state.userName);
    let actions;
    if (this.state.userNameAlreadyExists) {
      actions = [
        <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleCloseDialog}
            />, <FlatButton
                label="Start Chat"
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
                label="Start Chat"
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => {
                  this.doChatStuff();
                  this.handleCloseDialog();
                }}
            />,
      ];
    }

    return <div>
        <Paper style={styles.paper}><div style={styles.paperHeader}>
            {this.props.component.componentName}
            <IconButton style={styles.button}>
                <DeleteIcon color='#DDDDDD' onTouchTap={() => this.deleteChat()}
                            hoverColor={this.props.project.projectColor} /> </IconButton>
                <IconButton style={styles.button}>
                  <PersonButton color='#DDDDDD' onTouchTap={() => this.handleOpenDialog()}
                              hoverColor={this.props.project.projectColor} /> </IconButton>
        </div>
          <div style={styles.paperMiddle}></div></Paper>
      <div>
        <Dialog contentStyle={{ width: '400px' }}
                title="Insert a username"
                actions={actions}
                modal={false}
                open={this.state.dialogOpen}
                onRequestClose={this.handleCloseDialog}>
              <InputField
                  hintText="Enter a username."
                  value={this.state.userName}
                  id="userName"
                  floatingLabelText="username"
                  onChange={this.handleChange}
                  errorText={this.state.errorText}/>

        </Dialog>
      </div>

    </div>;
  }
}

