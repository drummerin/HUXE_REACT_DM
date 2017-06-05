import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import IconButton from 'material-ui/IconButton';
import ActionNew from 'material-ui/svg-icons/file/create-new-folder';
import Paper from 'material-ui/Paper';
import projects from '../projects';
import { setProject as setProjectAction } from '../actions';

const styles = {
  container: {
    padding: 10,
  },
  radioButton: {
    padding: 10,
  },
};

@connect(store => ({
  project: store.project,
}))

export default class Projects extends React.Component {

  static propTypes = {
    project: PropTypes.object,
    dispatch: PropTypes.func,
  };

  setProject(name) {
    const project = projects.find(loopProject => loopProject.name === name);
    if (project) {
      this.props.dispatch(setProjectAction(project));
    }
  }

  makeNewProject() {
    // console.log('new project clicked');
    console.log(this.props.project);
  }

  render() {
    return <div>
            <h1>{this.constructor.name}</h1>
            <Paper style={styles.container}>
                <RadioButtonGroup name="projects" valueSelected={this.props.project.name}
                                  onChange={(e, value) => this.setProject(value)}>
                    {projects.map(project => <RadioButton value={project.name}
                                                          label={project.name}
                                                          key={project.name}
                                                          style={styles.radioButton}/>)}
                </RadioButtonGroup>
                <IconButton className="addNewProjectButton"
                            onTouchTap={() => this.makeNewProject()}>
                    <ActionNew/>
                </IconButton>
            </Paper>
        </div>;
  }


}
