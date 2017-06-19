import React from 'react';
import {
    Link,
} from 'react-router-dom';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const emailRE = /^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/;

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
  error: {
    width: 250,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 25,
    padding: 10,
    color: 'red',
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
      textfieldError: true,
      signupError: false,
      signupErrorMessage: '',
    };
    this.passwordError = true;
    this.nameError = true;
    this.emailError = true;
  }

  static propTypes = {
    history: PropTypes.object,
  };

  addUser() {
    firebase.auth().createUserWithEmailAndPassword(this.state.user.email,
        this.state.user.password).then((user) => {
          user.updateProfile({
            displayName: this.state.user.name,
          }).then(() => {
            this.props.history.push('/login');
          }).catch((error) => {
            this.setState({
              signupError: true,
              signupErrorMessage: error.message,
            });
          });
        }).catch((error) => {
          this.setState({
            signupError: true,
            signupErrorMessage: error.message,
          });
        });
  }

  handleChange = (event, newValue) => {
    this.setState({
      user: {
        ...this.state.user,
        [event.target.id]: newValue,
      },
    });

    if (event.target.id === 'name') {
      if (newValue.length > 3) {
        this.nameError = false;
      } else {
        this.nameError = true;
      }
    }


    if (event.target.id === 'password') {
      if (newValue.length > 4 && newValue === this.state.user.password2) {
        this.passwordError = false;
      } else {
        this.passwordError = true;
      }
    }

    if (event.target.id === 'password2') {
      if (newValue.length > 4 && newValue === this.state.user.password) {
        this.passwordError = false;
      } else {
        this.passwordError = true;
      }
    }

    if (event.target.id === 'email') {
      if (newValue.length > 4 && emailRE.test(newValue)) {
        this.emailError = false;
      } else {
        this.emailError = true;
      }
    }

    if (!this.nameError && !this.emailError && !this.passwordError) {
      this.setState({
        textfieldError: false,
      });
    }
  };

  render() {
    return <div>
            <Paper style={styles.container}>
                <div style={ styles.logo }>
                    <img src="assets/logo.png" width="100" style={{ backgroundColor: '#9E9E9E' }}/>
                    <h1 style={styles.headline}>Signup</h1>
                </div>

                { this.state.signupError ?
                    <Paper style={styles.error}>
                        {this.state.signupErrorMessage}
                    </Paper> : null }

                { this.nameError ?
                    <Paper style={styles.error}>
                        Name missing
                    </Paper> : null }

                <div style={styles.inline}>
                    <TextField floatingLabelText="Name"
                               value={this.state.user.name}
                               id="name"
                               onChange={this.handleChange}
                               style={styles.textField}
                    />
                </div>

                { this.emailError ?
                    <Paper style={styles.error}>
                        Email missing
                    </Paper> : null }

                <div style={styles.inline}>
                    <TextField floatingLabelText="Email"
                               value={this.state.user.email}
                               id="email"
                               onChange={this.handleChange}
                               style={styles.textField}
                    />
                </div>

                { this.passwordError ?
                    <Paper style={styles.error}>
                        Password missing or passwords not equal
                    </Paper> : null }

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
                                  disabled={this.state.textfieldError}
                                  onTouchTap={() => { this.addUser(); }}
                    />

                    <Link to="/">
                        <RaisedButton label="Back"
                        />
                    </Link>
                </div>
            </Paper>
        </div>;
  }
}
