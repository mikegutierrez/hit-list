import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: 'http://localhost:8080/data',
      listings: [],
    };
    this.mapListings = this.mapListings.bind(this);
    this.getCities = this.getCities.bind(this);
    this.renderCitySelect = this.renderCitySelect.bind(this);
  }

  componentDidMount() {
    fetch(this.state.endpoint)
      .then(resp => resp.json())
      .then((data) => {
        const events = data.map(event => event);
        this.setState({ listings: events });
      })
      .catch(err => console.error(err));
  }

  getCities() {
    const { listings } = this.state;
    return listings.map(listing => listing.city).sort().filter((itm, pos, arr) => {
      return !pos || itm !== arr[pos - 1];
    });
  }

  mapListings() {
    const { listings } = this.state;
    return listings.map((event, idx) => {
      return (
        <div key={idx} className="listing margin-top-m margin-bottom-m padding-m box-shadow-light">
          <div><span>Headliner:</span> {event.headliner}</div>
          <div><span>Support:</span> {event.support}</div>
          <div><span>Venue:</span> {event.venue}</div>
          <div><span>Location:</span> {event.city}, {event.state}</div>
          <div><span>Date:</span> {event.date}</div>
          <div><span>Doors:</span> {event.time}</div>
          <div><a href={event.tickets} target="_blank">Tickets</a></div>
        </div>
      );
    });
  }

  renderCitySelect() {
    return (
      <select id="filter-city">
        <option value="city">City</option>
        {this.getCities().map((city, idx) => <option key={idx} value={city.replace(/\s/g, '')}>{city}</option>)}
      </select>
    );
  }

  render() {
    return (
      <div id="app" className="padding-m">
        <div id="listing-container">
          <div id="favorites">
            <div className="h4 fw-600 open-sans">Favorites</div>
          </div>
          <div id="listings">
            <div className="h4 fw-600 open-sans text-chr">Upcoming Concerts in Los Angeles</div>
            {this.state.listings && this.mapListings()}
          </div>
          <div id="filters">
            <div className="h4 fw-600 open-sans">Filters</div>
            {this.getCities() && this.renderCitySelect()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
