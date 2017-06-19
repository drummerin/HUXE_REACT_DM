import React from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import CommunicationCall from 'material-ui/svg-icons/communication/call';
import PersonButton from 'material-ui/svg-icons/maps/person-pin';
import FlatButton from 'material-ui/FlatButton';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import EditButton from 'material-ui/svg-icons/image/edit';
import Dialog from 'material-ui/Dialog';
import InputField from 'material-ui/TextField';
import IconButton from 'material-ui/IconButton';
import { green600 } from 'material-ui/styles/colors';
import { updateProject as updateProjectAction } from '../actions';
import Call from '../components/Call.jsx';
import { on, off, send } from '../ws';

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
    height: '170px',
    overflow: 'auto',
  },
  paperBottom: {
    padding: '0 20px 20px 20px',
    height: '50px',
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
  userPaper: {
    margin: 10,
  },
  user: {
    padding: '10px 15px',
  },
  iconButton: {
    marginLeft: 10,
    marginRight: 10,
  },
  ownMessages: {
    backgroundColor: 'green',
  },
  textfield: {
    padding: 10,
    margin: 10,
  },
  name: {
    color: 'inherit',
  },
  sender: {
    fontSize: 12,
    paddingBottom: '5px',
    color: 'grey',
    fontStyle: 'italic',
  },
  message: {
    padding: 10,
    marginBottom: 10,
    display: 'inline-block',
  },
  input: {
    marginTop: '-20px',
    width: '225px',
  },
};


@connect(store => ({
  project: store.project,
}))


export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      userDialogOpen: false,
      userNameAlreadyExists: true,
      errorText: 'this field is required!',

      nameInput: '',
      name: '',
      messageInput: '',
      messages: [],
      startChat: false,

      curUser: null,
      users: [],
    };
    this.nameInput = this.nameInput.bind(this);
    this.setName = this.setName.bind(this);
    this.addUser = this.addUser.bind(this);
  }


  static propTypes = {
    project: PropTypes.object,
    dispatch: PropTypes.func,
    component: PropTypes.object,
  };

  componentDidMount() {
    on('chat', (from, payload) => {
      this.setState({
        messages: [
          ...this.state.messages,
          {
            ...payload,
            name: from,
          },
        ],
      });
    });

    on('users', (from, payload) => {
      this.setState({
        users: [
          ...this.state.users,
          {
            ...payload,
            name: from,
          },
        ],
      });
    });
  }

  componentDidUpdate() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  componentWillUnmount() {
    this.setState({
      name: '',
      nameInput: '',
    });
    off('chat');
    off('users');
  }

  startCall(name) {
    this.handleCloseUserDialog();
    this.Call.startCall(name);
  }

  sendMessage(evt) {
    if (evt) {
      evt.preventDefault();
    }
    const id = Math.round(Math.random() * 100000000000).toString(36);
    send('chat', 'all', {
      id,
      message: this.state.messageInput,
    });
    this.setState({
      messageInput: '',
      messages: [
        ...this.state.messages,
        {
          message: this.state.messageInput,
          id,
          me: true,
        },
      ],
    });
  }

  nameInput = (input) => {
    this.setState({
      nameInput: input.replace(/[^\w\s]/gi, '').toLowerCase(),
    });
  };

  setName =(evt) => {
    if (evt) {
      evt.preventDefault();
    }
    send('join', 'all', this.state.nameInput);
    this.setState({
      name: this.state.nameInput,
    });
    this.addUser();
  };

  addUser = () => {
    const id = Math.round(Math.random() * 100000000000).toString(36);
    send('users', 'all', {
      id: this.state.nameInput,
      name: this.state.nameInput,
    });
    this.setState({
      users: [
        ...this.state.users,
        {
          name: this.state.nameInput,
          id,
          me: true,
        },
      ],
    });
  };

  startChat = () => {
    this.setState({
      startChat: true,
    });
    this.handleCloseUserDialog();
  };

  handleOpenDialog = () => {
    this.setState({ dialogOpen: true });
  };

  handleCloseDialog = () => {
    this.setState({ dialogOpen: false });
  };

  handleOpenUserDialog = () => {
    this.setState({ userDialogOpen: true });
  };

  handleCloseUserDialog = () => {
    this.setState({ userDialogOpen: false });
  };

  updateProjectAction(project) {
    this.props.dispatch(updateProjectAction(project));
  }

  deleteChat = () => {
    firebase.database().ref(`projects/${this.props.project.projectName}/components/${this.props.component.componentName}`).remove();
    this.updateProjectAction(this.props.project);
  };

  render() {
    const ownMessageColor = '#ddfbff';

    const actions = [
      <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleCloseDialog}
            />, <FlatButton
                label="Start Chat"
                disabled={!this.state.nameInput}
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => {
                  this.setName();
                  this.handleCloseDialog();
                  this.handleOpenUserDialog();
                }}
            />,
    ];

    const userActions = [
      <FlatButton
            label="Close"
            primary={true}
            onTouchTap={this.handleCloseUserDialog}
        />,
    ];

    return <div>
        <Paper style={styles.paper}>
          <div style={styles.paperHeader}>
            {this.props.component.componentName}
            <IconButton style={styles.button}>
                <DeleteIcon color='#DDDDDD' onTouchTap={() => this.deleteChat()}
                            hoverColor={this.props.project.projectColor} />
            </IconButton>
            <IconButton style={styles.button}>
              <PersonButton color='#DDDDDD' onTouchTap={() => this.handleOpenUserDialog()}
                            hoverColor={this.props.project.projectColor} />
            </IconButton>
              { !this.state.name ?
                <IconButton style={styles.button}>
                  <EditButton color='#DDDDDD' onTouchTap={() => this.handleOpenDialog()}
                              hoverColor={this.props.project.projectColor} />
                </IconButton> : null }
        </div>
          <div style={styles.paperMiddle}>
              { this.state.startChat ?
                      this.state.messages.map(chatItem => (
                          chatItem.me ?
                              <div key={chatItem.id} style={{ textAlign: 'right', marginRight: 5 }}>
                                <Paper style={{ ...styles.message,
                                  backgroundColor: ownMessageColor }}>
                                  <div style={styles.sender}>{this.state.name} </div>
                                    {chatItem.message}
                                </Paper>
                              </div> :
                              <div key={chatItem.id} >
                                <Paper style={styles.message}>
                                  <div style={styles.sender}>
                                    <div style={styles.name}>
                                        {chatItem.name}
                                    </div></div>
                                    {chatItem.message}
                                </Paper>
                              </div>
                      )) : null }
            < Call ref = {call => (this.Call = call)}/>
          </div>

            { this.state.startChat ?
          <div style={styles.paperBottom}><hr/>
              <form onSubmit={evt => this.sendMessage(evt)}>
                <InputField style={styles.input}
                    floatingLabelText="Write something"
                            fullWidth={true}
                            value={this.state.messageInput}
                            onChange={(e, v) =>
                                this.setState({ messageInput: v })} />
              </form>
          </div> : null }
        </Paper>

      <div>
        <Dialog contentStyle={{ width: '400px' }}
                title="Available User"
                actions={userActions}
                modal={true}
                open={this.state.userDialogOpen}
                onRequestClose={this.handleCloseUserDialog}>
          <Paper style={styles.userPaper} zDepth={2}>
            <Subheader>User</Subheader>
            <div>
                { this.state.users ?
                    this.state.users.map(user => (
                        !user.me ?
                            <div key={user.id} style={styles.user}>
                              <span style={{ marginRight: 10 }}>{user.name}</span>
                              <IconButton style={styles.iconButton}
                                          onTouchTap={() => this.startChat()}>
                                <CommunicationChatBubble color={green600}/>
                              </IconButton>
                              <IconButton style={styles.iconButton}
                                          onTouchTap={() => this.startCall(user.name)}
                                          disabled={this.state.call}>
                                <CommunicationCall color={green600}/>
                              </IconButton>
                            </div> : <div key={user.id} style={styles.user}>
                              <span style={{ marginRight: 10 }}>{user.name}</span>
                            </div>
                    )) : <div style={styles.user}>no user</div>
                }
            </div>
          </Paper>

        </Dialog>
      </div>

      <div>
          <Dialog contentStyle={{ width: '400px' }}
                title="Insert a username"
                actions={actions}
                modal={false}
                open={this.state.dialogOpen}
                onRequestClose={this.handleCloseDialog}>
            <InputField floatingLabelText="Enter a username"
                       fullWidth={true}
                       value={this.state.nameInput}
                       onChange={(e, v) => this.nameInput(v)}
            />
        </Dialog>
      </div>

    </div>;
  }
}

