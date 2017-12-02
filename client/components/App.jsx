import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: 'http://localhost:8080/data',
      listings: [],
      filteredList: [],
      selectedLocation: 'California',
      selectedVenue: '',
    };
    this.getSelectedData = this.getSelectedData.bind(this);
    this.filterData = this.filterData.bind(this);
    this.mapListings = this.mapListings.bind(this);
    this.renderSelect = this.renderSelect.bind(this);
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

  getSelectedData(selection) {
    const { listings, filteredList } = this.state;
    const mapList = () => {
      if (selection === 'venue' && filteredList.length) return filteredList;
      return listings;
    };
    return mapList().map(listing => listing[selection]).sort().filter((itm, pos, arr) => {
      return !pos || itm !== arr[pos - 1];
    });
  }

  filterData(event, selection) {
    const { listings } = this.state;
    const filter = listings.filter((listing) => {
      return listing[selection] === event.target.value;
    });
    const displayLocation = () => {
      if (selection === 'city') return event.target.value;
      if (!filter.length) return 'California';
      return filter[0].city;
    };
    this.setState({ filteredList: filter, selectedLocation: displayLocation(), selectedVenue: event.target.value });
  }

  mapListings(selection) {
    return selection.map((event, idx) => {
      return (
        <div key={idx} className="listing margin-top-m margin-bottom-m padding-m box-shadow-light">
          <div className="img-container">
            <a href={event.tickets} target="_blank">
              <img src={event.image} alt=""/>
            </a>
          </div>
          <div className="content-container">
            <div><span>Headliner:</span> {event.headliner}</div>
            <div><span>Support:</span> {event.support}</div>
            <div><span>Venue:</span> {event.venue}</div>
            <div><span>Location:</span> {event.city}, {event.state}</div>
            <div><span>Date:</span> {event.date}</div>
            <div><span>Doors:</span> {event.time}</div>
            <div><a href={event.tickets} target="_blank">Tickets</a></div>
          </div>
        </div>
      );
    });
  }

  renderSelect(selection, title) {
    const selectValue = selection === 'city' ? this.state.selectedLocation : this.state.selectedVenue;
    return (
      <select id={`filter-${selection}`} onChange={event => this.filterData(event, selection)} className="margin-bottom" value={selectValue}>
        <option value="California">{`All ${title}`}</option>
        {this.getSelectedData(selection).map((selection, idx) => <option key={idx} value={selection}>{selection}</option>)}
      </select>
    );
  }

  render() {
    const { listings, filteredList, selectedLocation } = this.state;
    const displayList = filteredList.length ? filteredList : listings;
    return (
      <div id="app" className="padding-m">
        <div id="listing-container">
          <div id="favorites">
            <div className="section-title">Favorites</div>
            <div className="underline-s" />
          </div>
          <div id="listings">
            <div className="section-title text-chr">Upcoming Concerts in {selectedLocation} - {displayList.length}</div>
            <div className="underline-s" />
            {this.state.listings && this.mapListings(displayList)}
          </div>
          <div id="filters">
            <div className="section-title">Filters</div>
            <div className="underline-s" />
            {this.getSelectedData('city') && this.renderSelect('city', 'Cities')}
            {this.getSelectedData('venue') && this.renderSelect('venue', 'Venues')}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
