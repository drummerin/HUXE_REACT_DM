import React from 'react';
import PropTypes from 'prop-types';


const styles = {
  element: {
    width: '100%',
    padding: 10,
    boxSizing: 'border-box',
    textAlign: 'center',
  },
  img: {
    width: 200,
  },
};

export default class MenuHeader extends React.Component {
    constructor(props){
        super(props);
    }

    static propTypes = {
        project: PropTypes.object.isRequired,
    };

    render() {
        return <div style={styles.element}>
            <img style={{width: 150, backgroundColor: this.props.project.projectColor}} src={`./assets/logo.png`}/>
        </div>;
    }
}
