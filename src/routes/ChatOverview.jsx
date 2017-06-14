/* eslint-disable class-methods-use-this */

import React from 'react';
import * as firebase from 'firebase';
import { List, ListItem } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';


const styles = {
  container: {
    padding: 10,
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
        users.push({ name: childData.name });
      });
      this.setState({
        users,
      });
      console.log(this.state.users);
    });
  }

  render() {
    return <div>

      <Paper style={styles.container}>
        <Subheader>User</Subheader>
        <List>
            { this.state.users ?
                this.state.users.map(user => (
                    <ListItem key={user.name}
                        primaryText={user.name}
                    />
                )) : 'no user'
            }
        </List>
      </Paper>
    </div>;
  }
}
