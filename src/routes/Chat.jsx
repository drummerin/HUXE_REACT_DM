/* eslint-disable class-methods-use-this */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Call from '../components/Call.jsx';
import { on, off, send } from '../ws';

const styles = {
  container: {
    padding: 10,
  },
  message: {
    padding: 10,
    marginBottom: 10,
    display: 'inline-block',
  },
  radioButton: {
    padding: 10,
  },
  name: {
    color: 'inherit',
  },
};

@connect(store => ({
  username: store.username,
}))
export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nameInput: '',
      name: '',
      messageInput: '',
      messages: [],
      blue: '#2f6fff',
    };
  }

  static propTypes = {
    username: PropTypes.object,
    dispatch: PropTypes.func,
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
  }

  componentDidUpdate() {
    window.scrollTo(0, document.body.scrollHeight);
  }

  componentWillUnmount() {
    off('chat');
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

  startCall(name) {
    this.Call.startCall(name);
  }

  render() {
    return <div>
      <h1>{this.constructor.name}</h1>
        {!this.state.name ?
          <Paper style={styles.container}>
            <form onSubmit={evt => this.setName(evt)}>
              <TextField floatingLabelText="Enter a username"
                         fullWidth={true}
                         value={this.state.nameInput}
                         onChange={(e, v) => this.nameInput(v)}
                         floatingLabelFocusStyle={{ color: this.state.blue }}
                         underlineFocusStyle={{ borderColor: this.state.blue }}/>
              <RaisedButton label="Start Chat"
                            primary={true}
                            disabled={!this.state.nameInput}
                            onTouchTap={() => this.setName()}
                            backgroundColor={this.state.blue}/>
            </form>
          </Paper> :
          <div>
            {this.state.messages.map(chatItem => (
                chatItem.me ?
                    <div key={chatItem.id} style={{ textAlign: 'right' }}>
                      <Paper style={styles.message}>
                        <span>{this.state.name}: </span>
                        {chatItem.message}
                      </Paper>
                    </div> :
                    <div key={chatItem.id} >
                      <Paper style={styles.message}>
                              <a href="#"
                                 style={styles.name}
                                 onClick={() => this.startCall(chatItem.name)}>
                                  {chatItem.name}
                              </a>
                        <span>: </span>
                          {chatItem.message}
                      </Paper>
                    </div>
            ))}
              <Paper style={styles.container}>
                <form onSubmit={evt => this.sendMessage(evt)}>
                  <TextField floatingLabelText="Write something"
                             fullWidth={true}
                             value={this.state.messageInput}
                             onChange={(e, v) => this.setState({ messageInput: v })}
                             floatingLabelFocusStyle={{ color: this.state.blue }}
                             underlineFocusStyle={{ borderColor: this.state.blue }}/>
                </form>
              </Paper>
            </div>
        }
      <Call ref={call => (this.Call = call)}/>
    </div>;
  }
}
