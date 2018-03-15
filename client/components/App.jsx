import React, { Component } from 'react';
import moment from 'moment';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: 'http://localhost:8080/data',
      listings: [],
      filteredList: [],
      selectedLocation: 'California',
      selectedVenue: '',
      favorites: [],
    };
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
      const data = {
        headliner: event.headliner,
        venue: event.venue,
        date: event.date,
        tickets: event.tickets,
      };
      const displaySupport = event.support !== 'Not Listed' ? <div className="support h6 fw-600">{event.support}</div> : null;
      return (
        <div key={idx} className="listing margin-top-m margin-bottom-m padding-m box-shadow-light">
          <div className="img-container">
            <a href={event.tickets} target="_blank">
              <img src={event.image} alt="" />
            </a>
          </div>
          <div className="content-container">
            <div className="margin-bottom-m">
              <div className="headliner h4 fw-600 text-gld0">{event.headliner} {this.renderStar(data)}</div>
              {displaySupport}
            </div>
            <div className="small fw-600">
              <div className="date">{event.date} at {event.time}</div>
              <div><span className="location text-gld0 uppercase">{event.venue}</span> in {event.city}, {event.state}</div>
            </div>
          </div>
          <div className="ticket-container">
            <a className="ticket-button" href={event.tickets} target="_blank">Tickets</a>
          </div>
        </div>
      );
    });
  }

  addToFavorites(event, data) {
    const { favorites } = this.state;
    const globalFavorites = [...favorites];

    event.target.classList.toggle('favoriteListing'); // this only handles class for current render. will lose class upon filtering

    // TODO: if object already in favorites, remove. else add it.
    // if (favorites.filter(obj => obj.headliner === data.headliner)) {
    //   // const index = favorites.indexOf(obj);
    //   // globalFavorites.splice(index, 1);
    // } else {
    //   globalFavorites.push({ data });
    // }
    globalFavorites.push({ data });
    this.setState({ favorites: globalFavorites });
  }

  renderFavorites() {
    const { favorites } = this.state;
    return favorites.map((favorite, idx) => {
      return (
        <div key={idx} className="favorite margin-bottom" onClick={() => window.open(favorite.data.tickets, '_blank')}>
          <div className="fw-600">{favorite.data.headliner}</div>
          <div className="xsmall">{favorite.data.date} at {favorite.data.venue}</div>
        </div>
      );
    });
  }

  renderStar(data) {
    return (
      <svg height="20" width="20" className="star" onClick={event => this.addToFavorites(event, data)}>
        <polygon points="9.9, 1.1, 3.3, 21.78, 19.8, 8.58, 0, 8.58, 16.5, 21.78" style={{ fillRule: 'nonzero' }} />
      </svg>
    );
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
            {this.state.favorites && this.renderFavorites()}
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
