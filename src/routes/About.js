import React from 'react';
import Paper from 'material-ui/Paper';
import pkg from '../../package.json';

const styles = {
  container: {
    padding: 10,
    lineHeight: '1.4em',
    color: '#656565',
    fontFamily: 'Asap',
    width: 600,
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
            <h1>About</h1>
            <Paper style={styles.container}>
                <p>
                    Developer: Susanne Meyer & Sophie Drummer<br/>
                    Contact: sophie.drummer@web.de<br/>
                    Version: {this.state.version}
                </p>

            </Paper>
        </div>;
  }
}
