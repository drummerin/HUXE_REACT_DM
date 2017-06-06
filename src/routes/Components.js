import React from 'react';
import Paper from 'material-ui/Paper';

const styles = {
  paper: {
    margin: '15px',
    padding: '10px',
    width: '300px',
    height: '300px',
    float: 'left',
  },
};

export default class Components extends React.Component {
  render() {
    return <div>
            <h1>{this.constructor.name}</h1>

            <Paper style={styles.paper}>To-do List</Paper>

            <Paper style={styles.paper}>Notes</Paper>

            <Paper style={styles.paper}>Sketches</Paper>

            <Paper style={styles.paper}>Placeholder</Paper>

            <Paper style={styles.paper}>Placeholder</Paper>

            <Paper style={styles.paper}>Placeholder</Paper>
        </div>;
  }
}
