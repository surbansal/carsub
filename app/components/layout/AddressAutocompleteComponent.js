import React, {Component} from 'react';
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from 'react-places-autocomplete';
import PropTypes from 'prop-types';
import './AddressAutocompleteComponent.scss';
import ZipCodeService from '../../services/api/ZipCodeService';
/* global google */

class AddressAutocompleteComponent extends Component {
  static populateAddress(address) {
    const selectedAddress = {
      streetAddress: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    };
    if (!address) {
      return selectedAddress;
    }
    const components = address.address_components;

    /* eslint-disable no-plusplus */
    for (let i = 0; i < components.length; i++) {
      const component = components[i];
      if (component.types.includes('postal_code')) {
        selectedAddress.zipCode = component.long_name;
      } else if (component.types.includes('country')) {
        selectedAddress.country = component.short_name;
      } else if (component.types.includes('administrative_area_level_1')) {
        selectedAddress.state = component.short_name;
      } else if (component.types.includes('locality')) {
        selectedAddress.city = component.long_name;
      } else if (component.types.includes('route') || component.types.includes('street_number') ||
        component.types.includes('establishment')) {
        selectedAddress.streetAddress += `${component.long_name} `;
      }
    }

    if (!selectedAddress.streetAddress || !selectedAddress.city || !selectedAddress.state || !selectedAddress.zipCode || !selectedAddress.country) {
      return {
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      };
    }
    return selectedAddress;
  }

  constructor(props) {
    super(props);
    this.state = {
      address: ''
    };
    this.setSearchOptionsLocationFromZipcode();
    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.updateAddress = this.updateAddress.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  setSearchOptionsLocationFromZipcode() {
    const zipCode = ZipCodeService.extractZipCode();
    geocodeByAddress(zipCode)
      .then((results) => {
        getLatLng(results[0]).then(({lat, lng}) => {
          this.setState({
            searchOptions: {
              location: new google.maps.LatLng(lat, lng),
              radius: 40000,
              types: ['address']
            }
          });
        });
      });
  }

  handleChange(address) {
    this.setState({ address });
  }

  updateAddress() {
    const {address} = this.state;
    this.handleSelect(address);
  }

  handleSelect(address) {
    geocodeByAddress(address)
      .then((results) => {
        const googleAddress = results[0];
        const selectedAddress = AddressAutocompleteComponent.populateAddress(googleAddress);
        this.setState({
          address: googleAddress.formatted_address
        });
        this.props.onSelect({ selectedAddress });
      });
  }

  handleBlur() {
    this.updateAddress();
  }

  render() {
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={this.handleSelect}
        searchOptions={this.state.searchOptions}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div className="places-autocomplete">
            <input
              {...getInputProps({
                placeholder: 'Search Places ...',
                className: 'location-search-input block',
                onBlur: this.handleBlur
              })}
            />
            <div className="autocomplete-dropdown-container">
              {suggestions.map((suggestion) => {
                const className = suggestion.active ? 'suggestion-item active' : 'suggestion-item';
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: '#fafafa', cursor: 'pointer' }
                  : { backgroundColor: '#ffffff', cursor: 'pointer' };
                return (
                  <div {...getSuggestionItemProps(suggestion, { className, style })}>
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

AddressAutocompleteComponent.propTypes = {
  onSelect: PropTypes.func.isRequired
};

export default AddressAutocompleteComponent;
