import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  element: {
    width: '100%',
    padding: 10,
    boxSizing: 'border-box',
    textAlign: 'center',
    color: '#FF0000',
  },
  img: {
    width: 200,
    backgroundColor: '#FF0000',
  },
};

// dynamisch je nach ausgewähltem sender :)
 const MenuHeader = ({ project }) => (
    <div style={styles.element}>
        <img style={styles.img} src={`./assets/logo.png`}/>
    </div>
);



MenuHeader.propTypes = {
  project: PropTypes.string.isRequired,
};

export default MenuHeader;
