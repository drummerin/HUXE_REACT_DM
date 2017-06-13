import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
  logo: {
    width: 100,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  headline: {
    textAlign: 'center',
    color: '#2f6fff',
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
    margin: '15px auto',
    padding: 10,
    width: 256,
  },
};

export default class Login extends React.Component {

  render() {
    return <div>
            <Paper style={styles.container}>
                <div style={ styles.logo }>
                    <img src="assets/HuxeLogo.png" width="100"/>
                    <h1 style={styles.headline}>Login</h1>
                </div>

                <div style={styles.inline}>
                    <TextField floatingLabelText="Email"
                               style={{ marginLeft: 'auto', marginRight: 'auto' }}
                    />
                </div>

                <div style={styles.inline}>
                    <TextField floatingLabelText="Password"
                           type="password"
                    />
                </div>

                <RaisedButton label="login"
                              primary={true}
                              />

                <RaisedButton label="signup"
                />
            </Paper>
        </div>;
  }
}
