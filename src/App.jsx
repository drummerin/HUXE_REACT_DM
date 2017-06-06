import React from 'react';
import PropTypes from 'prop-types';
import {
    BrowserRouter as Router,
    Link,
    Route,
} from 'react-router-dom';
import { connect } from 'react-redux';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import transitions from 'material-ui/styles/transitions';
import ProjectsIcon from 'material-ui/svg-icons/av/library-books';
import ComponentIcon from 'material-ui/svg-icons/action/dashboard';
import ChatIcon from 'material-ui/svg-icons/communication/chat';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import InfoIcon from 'material-ui/svg-icons/action/info';
import Projects from './routes/Projects';
import Components from './routes/Components';
import Settings from './routes/Settings';
import Chat from './routes/Chat.jsx';
import About from './routes/About';
import MenuHeader from './components/MenuHeader';

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
};

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#2f6fff',
  },
});

const routes = [
  {
    link: '/',
    exact: true,
    title: 'Projects',
    component: Projects,
    icon: <ProjectsIcon/>,
  },
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
  /* {
    link: '/todo',
    title: 'Todo',
    component: Todo,
    icon: <InfoIcon/>,
  },*/
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
    };
  }

  static propTypes = {
    project: PropTypes.object,
  };

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

  render() {
    const paddingLeft = (this.state.drawer.docked ? 256 : 0) + 16;

    document.querySelector('html').style.backgroundColor = styles.htmlStyles.backgroundColor;
    document.querySelector('html').style.color = styles.htmlStyles.color;

    return <MuiThemeProvider muiTheme={muiTheme}>
          <Router>
            <div>
              <AppBar title={this.state.project}
                      onLeftIconButtonTouchTap={() => this.toggleDrawer()}
                      iconStyleLeft={{ display: this.state.drawer.docked ? 'none' : 'block' }}
                      style={{ paddingLeft, backgroundColor: '#2f6fff' }}/>
              <Drawer open={this.state.drawer.open}
                      docked={this.state.drawer.docked}
                      onRequestChange={() => this.toggleDrawer()}>
              <MenuHeader project={this.props.project.name}/>
                  {routes.map(route => (
                      <Link to={route.link} key={route.link} style={styles.menuLink}>
                        <MenuItem primaryText={route.title}
                                  leftIcon={route.icon}
                                  onTouchTap={() => this.closeDrawer()}/>
                      </Link>
                  ))}
              </Drawer>
              <div style={{ ...styles.content, paddingLeft }}>
                  {routes.map(route => (
                      <Route exact={route.exact}
                             key={route.link}
                             path={route.link}
                             component={route.component}/>
                  ))}
              </div>
            </div>
          </Router>
        </MuiThemeProvider>;
  }
}
