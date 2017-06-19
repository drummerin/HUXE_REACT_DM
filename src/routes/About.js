import React from 'react';
import Paper from 'material-ui/Paper';
import pkg from '../../package.json';

const styles = {
  paper: {
    margin: '10px',
    width: '300px',
    height: '300px',
    float: 'left',
  },
  paperHeader: {
    padding: '15px 20px 10px 20px',
  },
  paperMiddle: {
    margin: '5px 0px 20px 0px',
    height: '220px',
    lineHeight: '25px',
    overflow: 'auto',
  },
  button: {
    padding: '0 10px 0 0',
    width: '25px',
    height: '25px',
    float: 'right',
  },

};


export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      version: pkg.version,
    };
  }

  render() {
    return <div>
        <Paper style={styles.paper}><div style={styles.paperHeader}>
            PlanIt!
            <hr/>
            <div style={styles.paperMiddle}>
            <p>
                <b>An application for planning and managing projects.</b> <br/>
                This is the 2nd HyperMedia User Experience Engineering project of
                Sophie Drummer & Susanne Meyer. The project topic is a project
                planning application, which shall contain several different
                contents such as todo-lists, post it notes, maps, sketches and chats.
                Multiple users are able to work on different projects simultaneously.
                Also, a webRTC based Chat component is implemented, for the best
                possible communication between different project members.
            </p></div>
        </div>
        </Paper>
        <Paper style={styles.paper}><div style={styles.paperHeader}>
            About
            <hr/>
            <div style={styles.paperMiddle}>
            <p>
                Developer: S. Meyer & S. Drummer<br/>
                Version: {this.state.version}<br/>
                Contact: <a href="mailto:sophie.drummer@web.de?Subject=PlanIt!">e-mail</a><br/>
                Issues? <a href="https://github.com/drummerin/HUXE_REACT_DM/issues">Help!</a>
            </p></div>
            </div>
        </Paper>
        <Paper style={styles.paper}><div style={styles.paperHeader}>
            How to use PlanIt!
            <hr/>
            <div style={styles.paperMiddle}>
                <p>
                    To create a new project, open the menu on the left side and click "New Project".
                    Now you can add components (PostIts, Todo-Lists, Maps, Sketches and Chats to
                    your  project. The projects will automatically be updated to the firebase
                    database. <br/> To delete your project, you have to open the right drawer
                    and click on the "delete" button.<br/><br/> If you have any troubles or
                    questions about PlanIt!, don't hesitate to contact
                    <a href="mailto:sophie.drummer@web.de?Subject=PlanIt!"> us </a>!
                </p></div>
        </div>
        </Paper>
        </div>;
  }
}
