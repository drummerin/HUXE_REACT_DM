import React from 'react';
import {
    Link,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  logo: {
    width: 100,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 15,
  },
  headline: {
    textAlign: 'center',
    color: '#9E9E9E',
  },
  container: {
    padding: 10,
    lineHeight: '1.4em',
    color: '#656565',
    fontFamily: 'Asap',
    width: 600,
    margin: 'auto',
  },
  inline: {
    margin: '10px auto',
    padding: 10,
    width: 256,
  },
  buttonsDiv: {
    width: 180,
    margin: ' 15px auto',
  },
};

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: '',
        password: '',
      },
      loginError: true,
    };
  }

  static propTypes = {
    history: PropTypes.object,
  };

  handleChange = (event, newValue) => {
    this.setState({
      user: {
        ...this.state.user,
        [event.target.id]: newValue,
      },
    });

    if (this.state.user.email.length > 4 && this.state.user.password.length > 4) {
      this.setState({
        loginError: false,
      });
    }
  };

  login() {
    firebase.auth().signInWithEmailAndPassword(this.state.user.email,
        this.state.user.password).then((user) => {
          // this.loginError = false;
          firebase.database().ref(`users/${user.uid}`).set({
            name: user.displayName,
          });
          this.props.history.push('/chat');
        }).catch((error) => {
            // Handle Errors here.
          const errorCode = error.code;
          // const errorMessage = error.message;

          if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-email') {
            // this.loginError = true;
            // this.errorMsg = 'Email oder Passwort falsch!';
          } else {
            // this.loginError = true;
            // this.errorMsg = errorMessage;
          }
          console.log(error);
        });
  }

  render() {
    return <div>
            <Paper style={styles.container}>
                <div style={ styles.logo }>
                    <img src="assets/logo.png" width="100" style={{ backgroundColor: '#9E9E9E' }}/>
                    <h1 style={ styles.headline }>Login</h1>
                </div>

                <div style={styles.inline}>
                    <TextField floatingLabelText="Email"
                               style={{ marginLeft: 'auto', marginRight: 'auto' }}
                               id="email"
                               onChange={this.handleChange}
                    />
                </div>

                <div style={styles.inline}>
                    <TextField floatingLabelText="Password"
                               id="password"
                               onChange={this.handleChange}
                           type="password"
                    />
                </div>

                <div style={ styles.buttonsDiv } >
                    <RaisedButton label="login"
                                  primary={true}
                                  onTouchTap={() => { this.login(); }}
                                  disabled={this.state.loginError}
                                  />

                    <Link to="/signup">
                        <RaisedButton label="signup"
                        />
                    </Link>
                </div>
            </Paper>
        </div>;
  }
}
