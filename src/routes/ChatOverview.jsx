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
import { green600, grey300 } from 'material-ui/styles/colors';
import Call from '../components/Call.jsx';


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
};

const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1,
};

export default class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      curUser: null,
      users: null,
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
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.database().ref(`users/${user.uid}`).once('value').then((snapshot) => {
          this.setState({
            curUser: snapshot.val().name,
          });
        });

        this.getAllUser();
        this.render();
      } else {
        this.setState({
          curUser: null,
        });
      }
    });
  }

  componentDidUpdate() {
    window.scrollTo(0, document.body.scrollHeight);
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

  /* startCall(name) {
    this.Call.startCall(name);
  } */

  start() {
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
  }

  hangup() {
    this.pc1.getVideoTracks()[0].stop();
    this.pc1.getAudioTracks()[0].stop();
  }

  render() {
    return <div>
        { this.state.curUser ?
            <Paper style={styles.container}>
                <Paper style={styles.userPaper} zDepth={2}>
                    <Subheader>User</Subheader>
                    <div>
                        { this.state.users ?
                            this.state.users.map(user => (
                                user.online ?
                                    <div key={user.name} style={styles.user}>
                                        <span style={{ marginRight: 10 }}>{user.name}</span>
                                        <IconButton style={styles.iconButton}
                                                    onTouchTap={() => this.start()}>
                                            <CommunicationChatBubble color={green600}/>
                                        </IconButton>
                                        <IconButton style={styles.iconButton}
                                                    onTouchTap={() => this.call()}
                                                    disabled={this.state.call}>
                                            <CommunicationCall color={green600}/>
                                        </IconButton>
                                        <IconButton style={styles.iconButton}
                                                    onTouchTap={() => this.hangup()}
                                                    disabled={!this.state.call}>
                                            <CommunicationCallEnd color={green600}/>
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
                <video src={this.state.localVideo} autoPlay="autoPlay"/>
                <br/>
                <video src={this.state.remoteVideo} autoPlay="autoPlay"/>

                <div>
                    <button id="startButton">Start</button>
                    <button id="callButton">Call</button>
                    <button id="hangupButton">Hang Up</button>
                </div>
                < Call ref = {call => (this.Call = call)}/>
            </Paper>
             :
            <Paper style={styles.loginMessage}>
                <div style={{ marginBottom: 15}}>You are not logged in. Please log in first.</div>
                <Link to="/login">
                    <RaisedButton label="login"
                            primary={true}/>
                </Link>
            </Paper>
        }
    </div>;
  }
}
