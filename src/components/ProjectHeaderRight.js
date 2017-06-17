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

const MenuHeader = ({ project }) => (
    <div style={styles.element}>
      <p>{project.projectName}</p>
      <hr/>
        <p>Authors: {project.projectAuthor}</p>
        <p>Description: {project.projectDescription}</p>
        <p>Deadline: {(project.projectDate).slice(0, ((project.projectDate).indexOf('201') + 4))}</p>
    </div>
);

MenuHeader.propTypes = {
  project: PropTypes.object.isRequired,
};

export default MenuHeader;
