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
    width: 100,
  },
};

// dynamisch je nach ausgewähltem sender :)
/* const MenuHeader = ({ station }) => (
    <div style={styles.element}>
        <img style={styles.img} src={`/logos/${station}-128-round.png`}/>
    </div>
);*/

const MenuHeader = ({ project }) => (
    <div style={styles.element}>
      <p>{project}</p>
      <hr/>
    </div>
);

MenuHeader.propTypes = {
  project: PropTypes.string.isRequired,
};

export default MenuHeader;
