import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Hit List App Component',
    };
  }

  render() {
    return (
      <div>{this.state.name}</div>
    );
  }
}

export default App;
