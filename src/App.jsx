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
import transitions from 'material-ui/styles/transitions';
import ProjectsIcon from 'material-ui/svg-icons/av/library-books';
import ComponentIcon from 'material-ui/svg-icons/action/dashboard';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import ChatIcon from 'material-ui/svg-icons/communication/chat';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import EditIcon from 'material-ui/svg-icons/image/edit';
import InfoIcon from 'material-ui/svg-icons/action/info';
import DeleteIcon from 'material-ui/svg-icons/action/delete';
import InfoOutlineIcon from 'material-ui/svg-icons/action/info-outline';
import NewProjectIcon from 'material-ui/svg-icons/file/create-new-folder';
import LogoutIcon from 'material-ui/svg-icons/action/input';
import SignUpIcon from 'material-ui/svg-icons/action/assignment-ind'
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ColorIcon from 'material-ui/svg-icons/image/color-lens';
import Dialog from 'material-ui/Dialog';
import DatePicker from 'material-ui/DatePicker';
import Calendar from 'material-ui/DatePicker/Calendar';
import InputField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import { List, ListItem } from 'material-ui/List';
import Projects from './routes/Projects';
import Settings from './routes/Settings';
import Chat from './routes/ChatOverview.jsx';
import Login from './routes/Login';
import Signup from './routes/Signup';
import About from './routes/About';
import ProjectHeaderRight from './components/ProjectHeaderRight';
import MenuHeader from './components/MenuHeader';
import { setProject as setProjectAction, updateProject as updateProjectAction } from './actions';
import projects from './projects';

const colorSelected = '#3189a6';

const colorList = [
  <MenuItem key={'color1'} value={'#808080'} primaryText="Gray" leftIcon={<ColorIcon color="#808080" />} />,
  <MenuItem key={'color2'} value={'#00626b'} primaryText="Teal" leftIcon={<ColorIcon color="#00626b" />} />,
  <MenuItem key={'color3'} value={'#000080'} primaryText="Blue" leftIcon={<ColorIcon color="#000080" />} />,
  <MenuItem key={'color4'} value={'#8B008B'} primaryText="Violet" leftIcon={<ColorIcon color="#8B008B" />} />,
  <MenuItem key={'color5'} value={'#800000'} primaryText="Red" leftIcon={<ColorIcon color="#800000" />} />,
  <MenuItem key={'color6'} value={'#d87600'} primaryText="Orange" leftIcon={<ColorIcon color="#d87600" />} />,
  <MenuItem key={'color7'} value={'#228B22'} primaryText="Green" leftIcon={<ColorIcon color="#228B22" />} />,
];

const styles = {
  htmlStyles: {
    backgroundColor: '#d8d8d8',
    color: '#A9A9A9',
  },
  content: {
    padding: 16,
    // maxWidth: 1000,
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

const routes = [
  {
    link: '/settings',
    title: 'Settings',
    component: Settings,
    icon: <SettingsIcon/>,
  },

  {
    link: '/chat',
    title: 'Chat',
    component: Chat,
    icon: <ChatIcon/>,
  },
  {
    link: '/about',
    title: 'Info',
    component: About,
    icon: <InfoIcon/>,
  },
  {
    link: '/',
    exact: true,
    title: 'Login',
    component: Login,
    icon: <LogoutIcon/>,
  },
  {
    link: '/signup',
    title: 'Signup',
    component: Signup,
    icon: <SignUpIcon/>,
  },
];


@connect(store => ({
  project: store.project,
  theme: store.theme,
}))

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      drawer: {
        open: false,
        docked: false,
      },
      drawerRight: {
        open: false,
      },
      dialogOpen: false,
      dialogDeleteOpen: false,
      newProjectDialog: {
        projectName: '',
        projectDescription: '',
        projectAuthor: '',
        projectDate: '',
        projectColor: '#808080',
        errorText: 'This field is required!',
        projectAlreadyExists: false,
      },
    };
    // this.buildProjectList = this.buildProjectList.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    App.handleTouchTapDay = App.handleTouchTapDay.bind(this);
  }

  static propTypes = {
    project: PropTypes.object,
    theme: PropTypes.object,
    dispatch: PropTypes.func,
    data: PropTypes.object,
    history: PropTypes.object,
    user: PropTypes.string,
  };

  static contextTypes = {
    router: PropTypes.object,
  };

  componentDidMount() {
    console.log('mount');

    const fbDb = firebase.database().ref('projects');
    fbDb.on('value', () => {
      this.updateProjectAction(this.props.project);
      this.setState({ dialogDeleteOpen: false });
      console.log('updating xxx ???');
    });
  }


  updateProjectAction(project) {
    this.props.dispatch(updateProjectAction(project));
  }

  toggleDrawer() {
    this.setState({
      drawer: {
        ...this.state.drawer,
        open: !this.state.drawer.open,
      },
    });
  }

  toggleDrawerRight() {
    this.setState({
      drawerRight: {
        ...this.state.drawerRight,
        open: !this.state.drawerRight.open,
      },
    });
  }

  closeDrawer() {
    this.toggleDrawer();
  }
  closeDrawerRight() {
    this.toggleDrawerRight();
  }

  handleOpenDialog = () => {
    this.setState({ dialogOpen: true });
  };

  handleCloseDialog = () => {
    this.setState({ dialogOpen: false });
  };

  handleDeleteDialogOpen = () => {
    this.setState({ dialogDeleteOpen: true });
  };
  handleDeleteDialogClose = () => {
    this.setState({ dialogDeleteOpen: false });
  };

  static handleTouchTapDay(event, date) {
    console.log(`date: ${date}${event}`);
  }

  logout() {
    firebase.auth().signOut().then(() => {
      this.closeDrawer();
    }).catch((error) => {
      console.log(`logout error: ${error}`);
    });
  }

  addProject() {
    firebase.database().ref(`projects/${this.state.newProjectDialog.projectName}`).set({
      projectName: this.state.newProjectDialog.projectName,
      projectDescription: this.state.newProjectDialog.projectDescription,
      projectAuthor: this.state.newProjectDialog.projectAuthor,
      projectDate: this.state.newProjectDialog.projectDate,
      projectColor: this.state.newProjectDialog.projectColor });
    this.setState({ newProjectDialog: {
      projectName: '',
      projectDescription: '',
      projectAuthor: '',
      projectDate: '',
      projectColor: '#808080',
    },
    });
  }

  setProject(name) {
    const project = projects.find(loopProject => loopProject === name);
    if (project) {
      this.props.dispatch(setProjectAction(project));
    }
  }

  deleteProject(project) {
    console.log(project);
    console.log(`delete!${projects.length}`);
    // const project = projects.find(loopProject => loopProject.projectName === name.projectName);
    // if (project) {
    console.log('delete');
    firebase.database().ref('projects').on('value', (projectList) => {
      projectList.forEach((childSnapshot) => {
        const childData = childSnapshot.val();
        console.log(`..${childData.projectName} .. ${project.projectName}`);
        if (childData.projectName === project.projectName) {
          console.log('deleted???');
          childSnapshot.ref.remove();
        }
      });
    });
    // }

    this.props.dispatch(setProjectAction(projects[0]));

    console.log(`delete!${projects.length}`);
  }

  handleChange = (event, newValue) => {
    this.setState({
      newProjectDialog: {
        ...this.state.newProjectDialog,
        [event.target.id]: event.target.value,
        projectAlreadyExists: false,
        errorText: '',
      },
    });
    projects.forEach((project) => {
      if (project.projectName === newValue) {
        console.log('jumps into checking TRUE');
        this.setState({
          newProjectDialog: {
            ...this.state.newProjectDialog,
            [event.target.id]: event.target.value,
            projectAlreadyExists: true,
            errorText: 'this project already exists!',
          },
        });
      }
    });
    if (newValue === '') {
      this.setState({
        newProjectDialog: {
          ...this.state.newProjectDialog,
          [event.target.id]: event.target.value,
          projectAlreadyExists: true,
          errorText: 'this field is required!',
        },
      });
    }
  };
  handleDateChange = (event, date) => {
    this.setState({
      newProjectDialog: {
        ...this.state.newProjectDialog,
        projectDate: date.toString(),
      },
    });
  };

  handleColorChange= (event, index, value) => {
    console.log(`color:${value}`);
    this.setState({
      newProjectDialog: {
        ...this.state.newProjectDialog,
        projectColor: value,
      },
    });
  };

  render() {
    console.log('render APP');
    const paddingLeft = (this.state.drawer.docked ? 256 : 0) + 16;

    document.querySelector('html').style.backgroundColor = styles.htmlStyles.backgroundColor;
    document.querySelector('html').style.color = styles.htmlStyles.color;

    const renderedProjectList = projects.map(project => (
        (this.props.project.projectName === project.projectName) ?
            <ListItem
                key={project.projectName}
                primaryText={project.projectName}
                leftIcon={<EditIcon color={project.projectColor}/>}
                style={{ color: project.projectColor }}
                onTouchTap={() => { this.closeDrawer(); this.setProject(project); }}/> :
            <ListItem
                key={project.projectName}
                primaryText={project.projectName}
                leftIcon={<ProjectsIcon color={project.projectColor}/>}
                onTouchTap={() => { this.closeDrawer(); this.setProject(project); }}/>
    ));
    renderedProjectList.push(<ListItem
        key="newProject"
        primaryText="New Project"
        leftIcon={<NewProjectIcon/>}
        onTouchTap={() => this.handleOpenDialog() }/>);


    let actions;
    if (this.state.newProjectDialog.projectAlreadyExists) {
      actions = [
        <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleCloseDialog}
            />, <FlatButton
                label="Add"
                disabled={true}
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => { this.handleOpenDialog(); }}
            />,
      ];
    } else {
      actions = [
        <FlatButton
                label="Cancel"
                primary={true}
                onTouchTap={this.handleCloseDialog}
            />, <FlatButton
                label="Add"
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => { this.addProject(); this.handleCloseDialog(); }}
            />,
      ];
    }

    const deleteActions = [
      <FlatButton
              label="Cancel"
              primary={true}
              onTouchTap={this.handleDeleteDialogClose}
          />,
      <FlatButton
              label="Delete"
              primary={true}
              keyboardFocused={true}
              onTouchTap={() => {
                this.deleteProject(this.props.project);
                this.handleDeleteDialogClose();
              }}
          />,
    ];


    console.log(`...${this.props.user}`);

    return <MuiThemeProvider muiTheme={this.props.theme}>
          <Router>
            <div>
              <AppBar title={this.props.user}
                      onLeftIconButtonTouchTap={() => this.toggleDrawer()}
                      iconStyleLeft={{ display: this.state.drawer.docked ? 'none' : 'block' }}
                      iconElementRight={<IconButton><InfoOutlineIcon/></IconButton>}
                      onRightIconButtonTouchTap={() => this.toggleDrawerRight()}
                      style={{ paddingLeft }}/>
              <Drawer open={this.state.drawer.open}
                      docked={this.state.drawer.docked}
                      onRequestChange={() => this.toggleDrawer()}>
                  <MenuHeader project={this.props.project}/>
                  { this.props.user ?
                  <List>
                      <Link to={'/projects'} key={'project'} style={styles.menuLink}>
                      <ListItem key="Projects"
                                primaryText="Projects"
                                leftIcon={<ComponentIcon/>}
                                initiallyOpen={true}
                                primaryTogglesNestedList={true}
                                nestedItems={ renderedProjectList }
                      /></Link>
                  {routes.map(route => (
                      route.component !== Login && route.component !== Signup ?
                      <Link to={route.link} key={route.link} style={styles.menuLink}>
                        <ListItem key={route.title}
                                  primaryText={route.title}
                                  leftIcon={route.icon}
                                  onTouchTap={() => this.closeDrawer()}/>
                      </Link> : null
                  ))}
                    <ListItem key="logout"
                              primaryText="Logout"
                              leftIcon={<LogoutIcon/>}
                              onTouchTap={() => this.logout()}/>
                  </List> : <List>
                          {routes.map(route => (
                              route.component === Login || route.component === Signup ?
                                  <Link to={route.link} key={route.link} style={styles.menuLink}>
                                    <ListItem key={route.title}
                                              primaryText={route.title}
                                              leftIcon={route.icon}
                                              onTouchTap={() => this.closeDrawer()}/>
                                  </Link> : null
                          ))}
                      </List> }
              </Drawer>
                <Drawer width={300} openSecondary={true} open={this.state.drawerRight.open} >
                    <AppBar
                        iconElementLeft={<IconButton><NavigationClose /></IconButton>}
                        iconElementRight={(this.props.project.projectName !== 'Meeting') ? <IconButton><DeleteIcon /></IconButton> : null}
                        onLeftIconButtonTouchTap={() => this.closeDrawerRight()}
                        onRightIconButtonTouchTap={() => this.handleDeleteDialogOpen()}
                    />
                    <ProjectHeaderRight project={this.props.project.projectName}/>
                    <Calendar firstDayOfWeek={1} onTouchTapDay={App.handleTouchTapDay}/>
                </Drawer>
                { this.props.user ?
              <div style={{ ...styles.content, paddingLeft }}>
                  {routes.map(route => (
                          <Route exact={route.exact}
                             key={route.link}
                             path={route.link}
                             component={route.component}/>
                  ))}
                  <Route path={'/projects'} key={'/projects'} component={Projects}/>
              </div> : <div style={{ ...styles.content, paddingLeft }}>
                        {routes.map(route => (
                            route.component === Login || route.component === Signup ?
                            <Route exact={route.exact}
                                   key={route.link}
                                   path={route.link}
                                   component={route.component}/> : null
                        ))}
                    </div> }
                <div>
                    <Dialog
                        title="Create a new Project"
                        actions={actions}
                        modal={false}
                        open={this.state.dialogOpen}
                        onRequestClose={this.handleCloseDialog}>
                        <Table height='250px'
                        selectable={false}><TableBody
                            displayRowCheckbox={false}><TableRow displayBorder={false}>
                            <TableRowColumn>
                                <InputField
                                   hintText="Enter the name of your project."
                                   value={this.state.newProjectDialog.projectName}
                                   id="projectName"
                                   floatingLabelText="Project name"
                                   onChange={this.handleChange}
                                   errorText={this.state.newProjectDialog.errorText}/>
                            </TableRowColumn>
                            <TableRowColumn>
                                <InputField
                                  hintText="Describe the topic and content of your project."
                                  value={this.state.newProjectDialog.projectDescription}
                                  id="projectDescription"
                                  floatingLabelText="Project description"
                                  onChange={this.handleChange}/>
                            </TableRowColumn>
                          </TableRow>
                            <TableRow displayBorder={false}><TableRowColumn>
                                <InputField
                                  hintText="The author(s) of this project."
                                  value={this.state.newProjectDialog.projectAuthor}
                                  id="projectAuthor"
                                  floatingLabelText="Project author(s)"
                                  onChange={this.handleChange}/>
                            </TableRowColumn>
                            <TableRowColumn>
                                <DatePicker
                                    hintText="Deadline."
                                    value={this.state.newProjectDialog.projectDate !== '' ? new Date(this.state.newProjectDialog.projectDate) : null}
                                    onChange={this.handleDateChange}/>
                            </TableRowColumn></TableRow>
                          <TableRow>
                          <TableRowColumn>
                            <SelectField
                                floatingLabelText="Color"
                                value={this.state.newProjectDialog.projectColor}
                                id="projectColor"
                                onChange={this.handleColorChange}>
                                {colorList}
                            </SelectField>
                          </TableRowColumn></TableRow>
                        </TableBody></Table>
                    </Dialog>
                    <Dialog
                        title="Delete project"
                        actions={deleteActions}
                        modal={false}
                        open={this.state.dialogDeleteOpen}
                        onRequestClose={this.handleClose}>
                        Are you sure that you want to delete this project?
                    </Dialog>
                </div>
            </div>
          </Router>
        </MuiThemeProvider>;
  }
}
