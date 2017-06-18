import React from 'react';
import PropTypes from 'prop-types';

const styles = {
  element: {
    width: '100%',
    padding: 10,
    boxSizing: 'border-box',
    textAlign: 'center',
  },
};

const MenuHeader = ({ project, user }) => (
    <div style={styles.element}>
      <p>{project.projectName}</p>
      <hr/>
        {(project.projectAuthor !== '') ? <p>Authors: {project.projectAuthor}</p> : null }
        {(project.projectDescription !== '') ? <p>Description: {project.projectDescription}</p> : null }
        {(project.projectDate !== '') ? <p>Deadline: {(project.projectDate).slice(0, ((project.projectDate).indexOf('201') + 4))}</p> : null }
    <hr/>
      <p>Your are logged in as: {user}</p>
        </div>
);

MenuHeader.propTypes = {
  project: PropTypes.object.isRequired,
  user: PropTypes.string.isRequired,
};

export default MenuHeader;
