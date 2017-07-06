import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Todo from './Todo';
import PostIt from './PostIt';
import Draw from './Draw';
import MapComp from './MapComp';
// import Chat from './Chat';


@connect(store => ({
  project: store.project,
}))


export default class Component extends React.Component {

  static propTypes = {
    project: PropTypes.object,
    dispatch: PropTypes.func,
    component: PropTypes.object,
  };

  render() {
    let Compo;
    if (this.props.component.componentType === 'Todo') {
      Compo = [
        <Todo key={this.props.component.componentName}
              project={this.props.project}
              component={this.props.component}
              name={this.props.component.componentName}/>,
      ];
    } else if (this.props.component.componentType === 'PostIt') {
      Compo = [
        <PostIt key={this.props.component.componentName}
                project={this.props.project}
                component={this.props.component}
                name={this.props.component.componentName}/>,
      ];
    } else if (this.props.component.componentType === 'Draw') {
      Compo = [
        <Draw key={this.props.component.componentName}
                  project={this.props.project}
                  component={this.props.component}
                  name={this.props.component.componentName}/>,
      ];
    } else if (this.props.component.componentType === 'MapComp') {
      Compo = [
        <MapComp key={this.props.component.componentName}
                project={this.props.project}
                component={this.props.component}
                name={this.props.component.componentName}/>,
      ];
    } /* else if (this.props.component.componentType === 'Chat') {
      Compo = [
        <Chat key={this.props.component.componentName}
                project={this.props.project}
                component={this.props.component}
                name={this.props.component.componentName}/>,
      ];
    } */
    return <div>
        {Compo}
    </div>;
  }


}

