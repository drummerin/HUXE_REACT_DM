import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Todo from './Todo';
import PostIt from './PostIt';


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
    }
    console.log(Compo);

    return <div>
        {Compo}
    </div>;
  }


}

