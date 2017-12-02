import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'Hit List App Component',
      endpoint: 'http://localhost:8080/data',
      listings: [],
    };
  }

  componentDidMount() {
    fetch(this.state.endpoint)
      .then(resp => resp.json())
      .then((data) => {
        const events = data.map((event, idx) => {
          return (
            <div key={idx} style={{ margin: '20px 0' }}>
              <div>Headliner: {event.headliner}</div>
              <div>Support: {event.support}</div>
              <div>Venue: {event.venue}</div>
              <div>Location: {event.city}, {event.state}</div>
              <div>Date: {event.date}</div>
              <div>Doors: {event.time}</div>
              <div><a href={event.tickets} target="_blank">Tickets</a></div>
            </div>
          );
        });
        this.setState({ listings: events });
        console.log('state:  ', this.state.listings);
      })
      .catch(err => console.error(err));
  }

  render() {
    console.log(this.state.listings);
    return (
      <div id="app">
        <div>{this.state.name}</div>
        <div>{this.state.listings}</div>
      </div>
    );
  }
}

export default App;
