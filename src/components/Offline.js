import React from 'react';
import Paper from 'material-ui/Paper';

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

export default class Component extends React.Component {


  render() {
    return <div>
      <Paper style={styles.paper}><div style={styles.paperHeader}>
        Check your internet connection!
        <hr/>
        <div style={styles.paperMiddle}>
          <p>
            It seems like your network connection is currently disabled.
            Please turn on your internet, to edit your projects!
          </p></div>
      </div>
      </Paper>
    </div>;
  }


}

