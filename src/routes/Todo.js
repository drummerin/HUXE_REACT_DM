import React from 'react';

export default class Todo extends React.Component {
  render() {
    return <div>
            <h1>{this.constructor.name}</h1>
        </div>;
  }
}
