/* eslint-disable class-methods-use-this */

import React from 'react';
import * as firebase from 'firebase';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import CommunicationCall from 'material-ui/svg-icons/communication/call';
import IconButton from 'material-ui/IconButton';
import { green600, grey300 } from 'material-ui/styles/colors';
import Call from '../components/Call.jsx';


const styles = {
  container: {
    padding: 10,
  },
  userPaper: {
    width: 250,
    margin: 10,
  },
  user: {
    padding: '10px 15px',
  },
  iconButton: {
    marginLeft: 10,
    marginRight: 10,
  },
};

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: null,
    };
  }

  static propTypes = {
  };

  componentDidMount() {
    this.getAllUser();
    this.render();
  }

  componentDidUpdate() {
    window.scrollTo(0, document.body.scrollHeight);
    this.getAllUser();
    this.render();
  }

  componentWillUnmount() {
  }

  getAllUser() {
    /* const userListRef = firebase.database().ref('users');
    const myUserRef = userListRef.push();

    // Monitor connection state on browser tab
    firebase.database().ref('.info/connected')
          .on(
              'value', (snap) => {
                if (snap.val()) {
                      // if we lose network then remove this user from the list
                  myUserRef.onDisconnect().remove();
                      // set user's online status
                  console.log(snap.val());
                } else {
                      // client has lost network
                  console.log(snap.val());
                }
              },
          ); */

    const users = [];
    firebase.database().ref('users').once('value').then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        users.push({ name: childData.name,
          online: childData.online });
      });
      this.setState({
        users,
      });
    });
  }

  startCall(name) {
    this.Call.startCall(name);
  }

  render() {
    return <div>

      <Paper style={styles.container}>
      <Paper style={styles.userPaper} zDepth={2}>
        <Subheader>User</Subheader>
        <div>
            { this.state.users ?
                this.state.users.map(user => (
                     user.online ?
                         <div key={user.name} style={styles.user}>
                           <span style={{ marginRight: 10 }}>{user.name}</span>
                        <IconButton style={styles.iconButton}>
                          <CommunicationChatBubble color={green600}/>
                        </IconButton>
                           <IconButton style={styles.iconButton}
                                       onTouchTap={() => this.startCall(user.name)}>
                             <CommunicationCall color={green600}/>
                           </IconButton>
                    </div>
                     :
                         <div key={user.name} style={styles.user}>
                           <span style={{ marginRight: 10 }}>{user.name}</span>
                           <IconButton style={styles.iconButton}>
                             <CommunicationChatBubble color={grey300}/>
                         </IconButton>
                         </div>
                )) : 'no user'
            }
        </div>
      </Paper>
      </Paper>

        <Call ref={call => (this.Call = call)}/>
    </div>;
  }
}