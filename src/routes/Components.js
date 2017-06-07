import React from 'react';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';

const styles = {
  paper: {
    margin: '15px',
    padding: '10px',
    width: '300px',
    height: '300px',
    float: 'left',
  },
  inlinePaper: {
    margin: 10,
    padding: 10,
    height: 180,
    overflow: 'auto',
  },
  todos: {
    padding: 5,
  },
  noteDiv: {
    height: 200,
    overflow: 'auto',
  },
  notePapers: {
    backgroundColor: '#c1c1c1',
    margin: 10,
    padding: 10,
  },
};

export default class Components extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todo: '',
    };
  }

  render() {
    return <div>
            <h1>{this.constructor.name}</h1>

            <Paper style={styles.paper}>To-do List
                <Paper zDepth={2} style={styles.inlinePaper}>
                    <div style={styles.todos}>Test</div>
                    <div style={styles.todos}>Test</div>
                    <div style={styles.todos}>Test</div>
                    <div style={styles.todos}>Test</div>
                    <div style={styles.todos}>Test</div>
                    <div style={styles.todos}>Test</div>
                </Paper>
                <TextField floatingLabelText="add todo"
                           fullWidth={true}
                           value={this.state.todo}
                />

            </Paper>

            <Paper style={styles.paper}>Notes
                <div style={styles.noteDiv}>
                    <Paper zDepth={2} style={styles.notePapers}>Test</Paper>
                    <Paper zDepth={2} style={styles.notePapers}>Test</Paper>
                    <Paper zDepth={2} style={styles.notePapers}>Test</Paper>
                    <Paper zDepth={2} style={styles.notePapers}>Test</Paper>
                    <Paper zDepth={2} style={styles.notePapers}>Test</Paper>
                </div>

                <TextField floatingLabelText="add note"
                           fullWidth={true}
                           value={this.state.todo}
                />
            </Paper>

            <Paper style={styles.paper}>Sketches</Paper>

            <Paper style={styles.paper}>Placeholder</Paper>

            <Paper style={styles.paper}>Placeholder</Paper>

            <Paper style={styles.paper}>Placeholder</Paper>
        </div>;
  }
}
