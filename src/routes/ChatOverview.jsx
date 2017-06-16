/* eslint-disable class-methods-use-this */

import React from 'react';
import * as firebase from 'firebase';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import CommunicationCall from 'material-ui/svg-icons/communication/call';
import CommunicationCallEnd from 'material-ui/svg-icons/communication/call-end';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { green600 } from 'material-ui/styles/colors';
import Call from '../components/Call.jsx';
import { on, off, send } from '../ws';

const styles = {
  container: {
    padding: 10,
  },
  userPaper: {
    width: 350,
    margin: 10,
  },
  user: {
    padding: '10px 15px',
  },
  iconButton: {
    marginLeft: 10,
    marginRight: 10,
  },
  loginMessage: {
    padding: 15,
  },
  ownMessages: {
    backgroundColor: 'green',
  },
  usernameTextfield: {
    padding: 10,
    margin: 10,
    width: 350,
  },
  textfield: {
    padding: 10,
    margin: 10,
  },
  messages: {
    width: 500,
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
};

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameInput: '',
      name: '',
      messageInput: '',
      messages: [],
      startChat: false,

      curUser: null,
      users: [],
    };
  }

  static propTypes = {
  };

  componentDidMount() {
    // this.isUserLoggedIn();

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

  isUserLoggedIn() {
    const user = firebase.auth().currentUser;

    if (user) {
      this.setState({
        curUser: user.displayName,
      });
    } else {
      this.setState({
        curUser: null,
      });
    }
  }

  componentWillMount() {

  }

  componentDidUpdate() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  componentWillUnmount() {
    console.log('unmount');
    this.setState({
      name: '',
      nameInput: '',
    });
    off('chat');
    off('users');
  }

  startCall(name) {
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

  nameInput(input) {
    this.setState({
      nameInput: input.replace(/[^\w\s]/gi, '').toLowerCase(),
    });
  }

  setName(evt) {
    if (evt) {
      evt.preventDefault();
    }
    send('join', 'all', this.state.nameInput);
    this.setState({
      name: this.state.nameInput,
    });
    this.addUser();
  }

  addUser() {
    send('users', 'all', {
      id: this.state.nameInput,
      name: this.state.nameInput,
    });
    this.setState({
      users: [
        ...this.state.users,
        {
          name: this.state.nameInput,
          id: this.state.nameInput,
          me: true,
        },
      ],
    });

    /* this.setState({
      users: [
        ...this.state.users,
        {
          name: this.state.nameInput,
        },
      ],
    }); */
  }

  startChat() {
    this.setState({
      startChat: true,
    });
  }

  render() {
    const ownMessageColor = '#ddfbff';

    return <div>
            <Paper style={styles.container}>
                <Paper style={styles.userPaper} zDepth={2}>
                    <Subheader>User</Subheader>
                    <div>
                        { this.state.users ?
                            this.state.users.map(user => (
                                !user.me ?
                                    <div key={user.name} style={styles.user}>
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
                                        <IconButton style={styles.iconButton}
                                                    onTouchTap={() => this.hangup()}
                                                    disabled={!this.state.call}>
                                            <CommunicationCallEnd color={green600}/>
                                        </IconButton>
                                    </div> : <div key={user.name} style={styles.user}>
                                        <span style={{ marginRight: 10 }}>{user.name}</span>
                                    </div>
                            )) : 'no user'
                        }
                    </div>
                </Paper>

                { !this.state.name ?
                <Paper style={styles.usernameTextfield} zDepth={2}>
                <form onSubmit={evt => this.setName(evt)}>
                    <TextField floatingLabelText="Enter a username"
                               fullWidth={true}
                               value={this.state.nameInput}
                               onChange={(e, v) => this.nameInput(v)}
                    />
                    <RaisedButton label="Add User"
                                  primary={true}
                                  disabled={!this.state.nameInput}
                                  onTouchTap={() => this.setName()}/>
                </form>
                </Paper> : null }
                { this.state.startChat ?
                    <Paper style={styles.messages}>
                        {this.state.messages.map(chatItem => (
                            chatItem.me ?
                                <div key={chatItem.id} style={{ textAlign: 'right' }}>
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
                        ))}
                        <Paper style={styles.textfield} zDepth={2}>
                            <form onSubmit={evt => this.sendMessage(evt)}>
                                <TextField floatingLabelText="Write something"
                                           fullWidth={true}
                                           value={this.state.messageInput}
                                           onChange={(e, v) =>
                                               this.setState({ messageInput: v })} />
                            </form>
                        </Paper>
                    </Paper> : null }
                < Call ref = {call => (this.Call = call)}/>
            </Paper>
    </div>;
  }
}
