import React from 'react';
import {
    Link,
} from 'react-router-dom';
import * as firebase from 'firebase';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

let nameError = true;
let emailError = true;
let passwordError = true;
const emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
  textField: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  buttonsDiv: {
    width: 180,
    margin: '15px auto',
  },
};

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: '',
        email: '',
        password: '',
        password2: '',
      },
      signupError: true,
    };
  }

  static propTypes = {
    history: React.PropTypes.object,
  };

  addUser() {
    firebase.auth().createUserWithEmailAndPassword(this.state.user.email,
        this.state.user.password).then((user) => {
          this.saveUser(user);
          user.updateProfile({
            displayName: this.state.user.name,
          }).then(() => {
            this.props.history.push('/projects');
          }).catch((error) => {
            console.log(error);
          });
        }).catch((error) => {
          console.log(error);
        });
  }

  handleChange = (event, newValue) => {
    this.setState({
      user: {
        ...this.state.user,
        [event.target.id]: newValue,
      },
    });

    if (event.target.id === 'name' && newValue.length > 4) {
      nameError = false;
    }

    if ((event.target.id === 'password' && newValue.length > 4 &&
        newValue === this.state.user.password2) ||
        (event.target.id === 'password2' && newValue.length > 4 &&
        newValue === this.state.user.password)) {
      passwordError = false;
    }

    if (event.target.id === 'email' && newValue.length > 4) {
      if (emailRE.test(newValue)) {
        emailError = false;
      }
    }

    if (!nameError && !emailError && !passwordError) {
      console.log('no err');
      this.setState({
        signupError: false,
      });
    }
  };

  saveUser(user) {
    firebase.database().ref(`users/${user.uid}`).set({
      name: this.name,
    });
  }

  render() {
    return <div>
            <Paper style={styles.container}>
                <div style={ styles.logo }>
                    <img src="assets/logo.png" width="100" style={{ backgroundColor: '#9E9E9E' }}/>
                    <h1 style={styles.headline}>Signup</h1>
                </div>

                <div style={styles.inline}>
                    <TextField floatingLabelText="Name"
                               value={this.state.user.name}
                               id="name"
                               onChange={this.handleChange}
                               style={styles.textField}
                    />
                </div>

                <div style={styles.inline}>
                    <TextField floatingLabelText="Email"
                               value={this.state.user.email}
                               id="email"
                               onChange={this.handleChange}
                               style={styles.textField}
                    />
                </div>

                <div style={styles.inline}>
                    <TextField floatingLabelText="Password"
                               value={this.state.user.password}
                               id="password"
                               onChange={this.handleChange}
                               type="password"
                    />
                </div>

                <div style={styles.inline}>
                    <TextField floatingLabelText="Repeat Password"
                               value={this.state.user.password2}
                               id="password2"
                               onChange={this.handleChange}
                               type="password"
                    />
                </div>

                <div style={ styles.buttonsDiv } >
                    <RaisedButton label="sign up"
                                  primary={true}
                                  disabled={this.state.signupError}
                                  onTouchTap={() => { this.addUser(); }}
                    />

                    <Link to="/login">
                        <RaisedButton label="back"
                        />
                    </Link>
                </div>
            </Paper>
        </div>;
  }
}
