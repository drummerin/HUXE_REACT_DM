/* eslint-disable class-methods-use-this */

import React from 'react';
import * as firebase from 'firebase';
import { List, ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import CommunicationCall from 'material-ui/svg-icons/communication/call';
import IconButton from 'material-ui/IconButton';
import { green600, grey300 } from 'material-ui/styles/colors';


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

  componentWillMount() {
    this.getAllUser();
  }

  componentDidUpdate() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  componentWillUnmount() {
  }

  getAllUser() {
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
                           <IconButton style={styles.iconButton}>
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
    </div>;
  }
}
