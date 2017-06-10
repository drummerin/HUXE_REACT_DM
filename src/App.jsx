import React from 'react';
import PropTypes from 'prop-types';
import * as firebase from 'firebase';
import {
    BrowserRouter as Router,
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import transitions from 'material-ui/styles/transitions';
import ProjectsIcon from 'material-ui/svg-icons/av/library-books';
import ComponentIcon from 'material-ui/svg-icons/action/dashboard';
import ChatIcon from 'material-ui/svg-icons/communication/chat';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import EditIcon from 'material-ui/svg-icons/image/edit';
import InfoIcon from 'material-ui/svg-icons/action/info';
import NewProjectIcon from 'material-ui/svg-icons/file/create-new-folder';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

import { List, ListItem } from 'material-ui/List';

import Projects from './routes/Projects';
import Components from './routes/Components';
import Settings from './routes/Settings';
import Chat from './routes/Chat.jsx';
import About from './routes/About';
import MenuHeader from './components/MenuHeader';
import { setProject as setProjectAction, addProject as addProjectAction } from './actions';
import projects from './projects';

const colorSelected = '#3189a6';

const styles = {
  htmlStyles: {
    backgroundColor: '#d8d8d8',
    color: '#A9A9A9',
  },
  content: {
    padding: 16,
    maxWidth: 1000,
    transition: transitions.easeOut(null, 'padding-left', null),
    color: '#2f6fff',
  },
  menuLink: {
    textDecoration: 'none',
  },
  selectedProject: {
    color: colorSelected,
  },
};

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#2f6fff',
  },
});

const routes = [
  {
    link: '/components',
    title: 'Components',
    component: Components,
    icon: <ComponentIcon/>,
  },
  {
    link: '/settings',
    title: 'Settings',
    component: Settings,
    icon: <SettingsIcon/>,
  },
  {
    link: '/about',
    title: 'Info',
    component: About,
    icon: <InfoIcon/>,
  },
  {
    link: '/chat',
    title: 'Chat',
    component: Chat,
    icon: <ChatIcon/>,
  },
];

@connect(store => ({
  project: store.project,
}))

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drawer: {
        open: false,
        docked: false,
      },
      dialogOpen: false,
      newProjectDialog: {
        input: '',
      },
    };
    this.buildProjectList = this.buildProjectList.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  static propTypes = {
    project: PropTypes.object,
    dispatch: PropTypes.func,
  };


  componentWillMount() {
    firebase.database().ref('projects').on('value', this.buildProjectList);
    console.log('component mounts');
  }

  buildProjectList(dataSnapshot) {
    if (projects.length > 0) {
      // this.state.projectList.splice(0, this.state.projectList.length);
      projects.splice(2, projects.length);
    }
    dataSnapshot.forEach((childSnapshot) => {
            // childData will be the actual contents of the child
      const childData = childSnapshot.val();
      console.log(`childData ${childData.projectName}`);
      // if (this.state.projectList.indexOf(childData) === -1) {
      if (projects.indexOf(childData) === -1) {
        console.log('not contained');
        projects.push(childData);
        console.log(`proj file length${projects.length}`);
      }
    });
    console.log(`projectList ${projects}`);
    this.setState(this.state);
  }

  toggleDrawer() {
    this.setState({
      drawer: {
        ...this.state.drawer,
        open: !this.state.drawer.open,
      },
    });
  }

  closeDrawer() {
    if (!this.state.sidebarDocked) {
      this.toggleDrawer();
    }
  }

  handleOpenDialog = () => {
    this.setState({ dialogOpen: true });
  };

  handleCloseDialog = () => {
    this.setState({ dialogOpen: false });
  };
  addProject() {
    firebase.database().ref('projects').push({
      projectName: this.state.newProjectDialog.input });
    const project = projects.find(loopProject => loopProject === name);
    if (project) {
      this.props.dispatch(addProjectAction(project));
    }
  }
  setProject(name) {
    const project = projects.find(loopProject => loopProject === name);
    if (project) {
      this.props.dispatch(setProjectAction(project));
    }
  }

  handleChange = (event) => {
    this.setState({
      newProjectDialog: {
        ...this.state.newProjectDialog,
        input: event.target.value,
      },
    });
  };

  render() {
    const paddingLeft = (this.state.drawer.docked ? 256 : 0) + 16;

    document.querySelector('html').style.backgroundColor = styles.htmlStyles.backgroundColor;
    document.querySelector('html').style.color = styles.htmlStyles.color;

    const renderedProjectList = projects.map(project => (
        (this.props.project.projectName === project.projectName) ?
            <ListItem
                key={project.projectName}
                primaryText={project.projectName}
                leftIcon={<EditIcon color={colorSelected}/>}
                style={styles.selectedProject}
                onTouchTap={() => { this.closeDrawer(); this.setProject(project); }}/> :
            <ListItem
                key={project.projectName}
                primaryText={project.projectName}
                leftIcon={<ProjectsIcon/>}
                onTouchTap={() => { this.closeDrawer(); this.setProject(project); }}/>
    ));
    renderedProjectList.push(<ListItem
        key="newProject"
        primaryText="New Project"
        leftIcon={<NewProjectIcon/>}
        onTouchTap={() => this.handleOpenDialog() }/>);

    const actions = [
      <FlatButton
              label="Cancel"
              primary={true}
              onTouchTap={this.handleCloseDialog}
          />,
      <FlatButton
              label="Add"
              primary={true}
              keyboardFocused={true}
              onTouchTap={() => { this.addProject(); this.handleCloseDialog(); }}
          />,
    ];

    return <MuiThemeProvider muiTheme={muiTheme}>
          <Router>
            <div>
              <AppBar title={this.state.project}
                      onLeftIconButtonTouchTap={() => this.toggleDrawer()}
                      iconStyleLeft={{ display: this.state.drawer.docked ? 'none' : 'block' }}
                      style={{ paddingLeft }}/>
              <Drawer open={this.state.drawer.open}
                      docked={this.state.drawer.docked}
                      onRequestChange={() => this.toggleDrawer()}>
              <MenuHeader project={this.props.project.projectName}/>
                  <List>
                      <Link to={'/projects'} key={'project'} style={styles.menuLink}>
                      <ListItem key="Projects"
                                primaryText="Projects"
                                leftIcon={<ProjectsIcon/>}
                                initiallyOpen={true}
                                primaryTogglesNestedList={true}
                                nestedItems={ renderedProjectList }
                      /></Link>
                  {routes.map(route => (
                      <Link to={route.link} key={route.link} style={styles.menuLink}>
                        <ListItem key={route.title}
                                  primaryText={route.title}
                                  leftIcon={route.icon}
                                  onTouchTap={() => this.closeDrawer()}/>
                      </Link>
                  ))}
                  </List>
              </Drawer>
              <div style={{ ...styles.content, paddingLeft }}>
                  {routes.map(route => (
                      <Route exact={route.exact}
                             key={route.link}
                             path={route.link}
                             component={route.component}/>
                  ))}
                  <Route path={'/projects'} key={'/projects'} component={Projects}/>
              </div>
                <div>
                    <Dialog
                        title="Create a new Project"
                        actions={actions}
                        modal={false}
                        open={this.state.dialogOpen}
                        onRequestClose={this.handleCloseDialog}>
                        Create a new Project!
                        <form>
                        <input type="text"
                               placeholder="Enter project name"
                               value={this.state.newProjectDialog.input}
                               style={styles.flatButton}
                               onChange={this.handleChange}
                        /></form>
                    </Dialog>
                </div>
            </div>
          </Router>
        </MuiThemeProvider>;
  }
}
