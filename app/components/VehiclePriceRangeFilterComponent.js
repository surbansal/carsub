import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InputRange from 'react-input-range';
import './VehiclePriceRangeFilterComponent.scss';

class VehiclePriceRangeFilterComponent extends Component {
  render() {
    return (
      <div>
        <label htmlFor="max-price-label">Max Price</label>
        <div className="filter-slider-wrapper">
          <label className="price-per-month" htmlFor="slider-value-label">${this.props.partiallySelectedMaxBasePrice} / month</label>
          <InputRange
            minValue={this.props.minRangeValue}
            maxValue={this.props.maxRangeValue}
            value={this.props.partiallySelectedMaxBasePrice}
            onChange={value => this.props.updatePartiallySelectedMaxBasePrice(value)}
            onChangeComplete={value => this.props.updateRangeFilter(value)}
          />
        </div>
      </div>
    );
  }
}

VehiclePriceRangeFilterComponent.propTypes = {
  updateRangeFilter: PropTypes.func.isRequired,
  updatePartiallySelectedMaxBasePrice: PropTypes.func.isRequired,
  partiallySelectedMaxBasePrice: PropTypes.string.isRequired,
  maxRangeValue: PropTypes.string.isRequired,
  minRangeValue: PropTypes.string.isRequired,
};


export default VehiclePriceRangeFilterComponent;
