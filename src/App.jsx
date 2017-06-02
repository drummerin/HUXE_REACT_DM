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
import transitions from 'material-ui/styles/transitions';
import ProjectsIcon from 'material-ui/svg-icons/av/library-books';
import ComponentIcon from 'material-ui/svg-icons/action/dashboard';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import InfoIcon from 'material-ui/svg-icons/action/info';
import Projects from './routes/Projects';
import Components from './routes/Components';
import Settings from './routes/Settings';
import About from './routes/About';
import Todo from './routes/Todo';
import MenuHeader from './components/MenuHeader';


const styles = {
  content: {
    padding: 16,
    maxWidth: 800,
    transition: transitions.easeOut(null, 'padding-left', null),
  },
  menuLink: {
    textDecoration: 'none',
  },
};

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
    link: '/todo',
    title: 'Todo',
    component: Todo,
    icon: <InfoIcon/>,
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
    };
  }

  static propTypes = {
    project: PropTypes.object,
  };

  componentWillMount() {
    const mql = window.matchMedia('(min-width: 840px)');
    mql.addListener(() => {
      this.mqlChange(mql.matches);
    });
    this.mqlChange(mql.matches);
  }

  mqlChange(matches) {
    this.setState({
      drawer: {
        open: matches,
        docked: matches,
      },
    });
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
      this.setState({
        sidebarOpen: false,
      });
    }
  }

  render() {
    const paddingLeft = (this.state.drawer.docked ? 256 : 0) + 16;

    return <MuiThemeProvider>
          <Router>
            <div>
              <AppBar title={this.state.project}
                      onLeftIconButtonTouchTap={() => this.toggleDrawer()}
                      iconStyleLeft={{ display: this.state.drawer.docked ? 'none' : 'block' }}
                      style={{ paddingLeft }}/>
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
                      <Route exact
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
