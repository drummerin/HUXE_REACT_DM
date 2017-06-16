/* eslint-disable class-methods-use-this */

import React from 'react';
import {
    Link,
} from 'react-router-dom';
import * as firebase from 'firebase';
import Paper from 'material-ui/Paper';
import Subheader from 'material-ui/Subheader';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import CommunicationCall from 'material-ui/svg-icons/communication/call';
import CommunicationCallEnd from 'material-ui/svg-icons/communication/call-end';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { green600, grey300 } from 'material-ui/styles/colors';
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
  textFieldPaper: {
    padding: 15,
    margin: 10,
    width: 350,
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

const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1,
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
      localVideo: null,
      remoteVideo: null,
      localStream: null,
      call: false,
      startTime: null,
    };
    this.pc1 = null;
    this.pc2 = null;
  }

  static propTypes = {
  };

  componentDidMount() {
    this.isUserLoggedIn();

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
    this.setState({
      name: '',
      nameInput: '',
    });
    off('chat');
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

/*  start() {
    console.log('Requesting local stream');

    navigator.mediaDevices.getUserMedia({
      audio: false,
      video: true,
    })
    .then((stream) => {
      window.stream = stream; // stream available to console
      this.setState({
        localStream: stream,
      });
      if (window.URL) {
        this.setState({
          localVideo: window.URL.createObjectURL(stream),
        });
      } else {
        this.setState({
          localVideo: stream,
        });
      }
    })
    .catch((e) => {
      console.log(`getUserMedia() error: ${e.name}`);
    });
  }

  call() {
    this.setState({
      call: true,
    });

    console.log('Starting call');
    this.setState({
      startTime: window.performance.now(),
    });

    const videoTracks = this.state.localStream.getVideoTracks();
    const audioTracks = this.state.localStream.getAudioTracks();
    if (videoTracks.length > 0) {
      console.log(`Using video device: ${videoTracks[0].label}`);
    }
    if (audioTracks.length > 0) {
      console.log(`Using audio device: ${audioTracks[0].label}`);
    }
    const servers = null;
        // Add pc1 to global scope so it's accessible from the browser console
    window.pc1 = new RTCPeerConnection(servers);
    this.pc1 = window.pc1;
    console.log('Created local peer connection object pc1');

    this.pc1.onicecandidate = (e) => {
      this.onIceCandidate(this.pc1, e);
    };

        // Add pc2 to global scope so it's accessible from the browser console
    window.pc2 = new RTCPeerConnection(servers);
    this.pc2 = window.pc2;

    console.log('Created remote peer connection object pc2');
    this.pc2.onicecandidate = (e) => {
      this.onIceCandidate(this.pc2, e);
    };
    this.pc1.oniceconnectionstatechange = (e) => {
      this.onIceStateChange(this.pc1, e);
    };

    this.pc2.oniceconnectionstatechange = (e) => {
      this.onIceStateChange(this.pc2, e);
    };

    this.pc2.onaddStream = (e) => {
      console.log('on add stream');
      this.gotRemoteStream(e);
    };
    // this.state.pc2.onaddstream = this.gotRemoteStream();

    this.pc1.addStream(this.state.localStream);
    console.log('Added local stream to pc1');

    console.log('pc1 createOffer start');
    this.pc1.createOffer(
            offerOptions,
        ).then((offer) => {
          this.onCreateOfferSuccess(offer);
        }).catch((err) => {
          this.onCreateSessionDescriptionError(err);
        });
  }

  onCreateSessionDescriptionError(error) {
    console.log(`Failed to create session description: ${error.toString()}`);
  }

  onCreateOfferSuccess(desc) {
    console.log('Offer from pc1');
    console.log('pc1 setLocalDescription start');
    this.pc1.setLocalDescription(desc).then(() => {
      this.onSetLocalSuccess(this.pc1);
    }).catch((error) => {
      this.onSetSessionDescriptionError(error);
    });
    console.log('pc2 setRemoteDescription start');
    this.pc2.setRemoteDescription(desc).then(() => {
      this.onSetRemoteSuccess(this.pc2);
    }).catch((error) => {
      this.onSetSessionDescriptionError(error);
    });
    console.log('pc2 createAnswer start');
        // Since the 'remote' side has no media stream we need
        // to pass in the right constraints in order for it to
        // accept the incoming offer of audio and video.
    this.pc2.createAnswer().then((answer) => {
      this.onCreateAnswerSuccess(answer);
    }).catch((err) => {
      this.onCreateSessionDescriptionError(err);
    });
  }

  onSetLocalSuccess(pc) {
    console.log(`${this.getName(pc)} setLocalDescription complete`);
  }

  onSetRemoteSuccess(pc) {
    console.log(`${this.getName(pc)} setRemoteDescription complete`);
  }

  onSetSessionDescriptionError(error) {
    console.log(`Failed to set session description: ${error.toString()}`);
  }

  gotRemoteStream(e) {
    console.log(`e ${e}`);
        // Add remoteStream to global scope so it's accessible from the browser console
    window.remoteStream = e.stream;
    this.setState({
      remoteVideo: this.state.localStream,
    });
    console.log('pc2 received remote stream');
  }

  onCreateAnswerSuccess(desc) {
    console.log('Answer from pc2:');
    console.log('pc2 setLocalDescription start');
    this.pc2.setLocalDescription(desc).then(() => {
      this.onSetLocalSuccess(this.pc2);
    }).catch((error) => {
      this.onSetSessionDescriptionError(error);
    });
    console.log('pc1 setRemoteDescription start');
    this.pc1.setRemoteDescription(desc).then(() => {
      this.onSetRemoteSuccess(this.pc1);
    }).catch((error) => {
      this.onSetSessionDescriptionError(error);
    });
  }

  onIceCandidate(pc, event) {
    if (event.candidate) {
      this.getOtherPc(pc).addIceCandidate(
                new RTCIceCandidate(event.candidate),
            ).then(
                () => {
                  this.onAddIceCandidateSuccess(pc);
                },
                (err) => {
                  this.onAddIceCandidateError(pc, err);
                },
            );
      console.log(`${this.getName(pc)} ICE candidate: \n${event.candidate.candidate}`);
    }
  }

  onAddIceCandidateSuccess(pc) {
    console.log(`${this.getName(pc)} addIceCandidate success`);
  }

  onAddIceCandidateError(pc, error) {
    console.log(`${this.getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
  }

  onIceStateChange(pc, event) {
    if (pc) {
      console.log(`${this.getName(pc)} ICE state: ${pc.iceConnectionState}`);
      console.log('ICE state change event: ', event);
    }
  }

  getOtherPc(pc) {
    return (pc === this.pc1) ? this.pc2 : this.pc1;
  }

  getName(pc) {
    return (pc === this.pc1) ? 'pc1' : 'pc2';
  } */

  hangup() {
    // this.pc1.getVideoTracks()[0].stop();
    // this.pc1.getAudioTracks()[0].stop();
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
    this.setState({
      users: [
        ...this.state.users,
        {
          name: this.state.nameInput,
        },
      ],
    });
  }

  startChat() {
    this.setState({
      startChat: true,
    });
  }

  render() {
    const ownMessageColor = '#ddfbff';

    return <div>
        { this.state.curUser ?
            <Paper style={styles.container}>
                <Paper style={styles.userPaper} zDepth={2}>
                    <Subheader>User</Subheader>
                    <div>
                        { this.state.users ?
                            this.state.users.map(user => (
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
                                    </div>
                            )) : 'no user'
                        }
                    </div>
                </Paper>

                { !this.state.name ?
                <Paper style={styles.textFieldPaper} zDepth={2}>
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
                                            <a href="#"
                                               style={styles.name}
                                               onClick={() => this.startCall(chatItem.name)}>
                                            {chatItem.name}
                                        </a></div>
                                        {chatItem.message}
                                    </Paper>
                                </div>
                        ))}
                        <Paper style={styles.textFieldPaper} zDepth={2}>
                            <form onSubmit={evt => this.sendMessage(evt)}>
                                <TextField floatingLabelText="Write something"
                                           fullWidth={true}
                                           value={this.state.messageInput}
                                           onChange={(e, v) =>
                                               this.setState({ messageInput: v })} />
                            </form>
                        </Paper>
                    </Paper> : null }

                <video src={this.state.localVideo} autoPlay="autoPlay"/>
                <br/>
                <video src={this.state.remoteVideo} autoPlay="autoPlay"/>

                {/* <div>
                    <button id="startButton">Start</button>
                    <button id="callButton">Call</button>
                    <button id="hangupButton">Hang Up</button>
                </div>*/ }
                < Call ref = {call => (this.Call = call)}/>
            </Paper>
             :
            <Paper style={styles.loginMessage}>
                <div style={{ marginBottom: 15 }}>You are not logged in. Please log in first.</div>
                <Link to="/login">
                    <RaisedButton label="login"
                            primary={true}/>
                </Link>
            </Paper>
        }
    </div>;
  }
}
