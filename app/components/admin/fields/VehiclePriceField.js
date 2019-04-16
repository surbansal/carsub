import React, {Component} from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {Api} from '../../../config/ApplicationContext';
import './VehiclePriceField.scss';

class VehiclePriceField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehiclePublicId: '',
      sortedPricesData: null,
      basePrice: 0,
    };
    this.handlePricesChange = this.handlePricesChange.bind(this);
    this.handleMileagePackagePriceChange = this.handleMileagePackagePriceChange.bind(this);
    this.handleBasePriceChange = this.handleBasePriceChange.bind(this);
    this.filterAndSortPricesData = this.filterAndSortPricesData.bind(this);
  }
  componentWillMount() {
    const prices = get(this.props.record, this.props.source);
    if (prices == null) {
      Api.get('/admin/vehicle/prices/static').then((response) => {
        this.filterAndSortPricesData(response);
      });
    } else {
      this.filterAndSortPricesData(prices);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.record.prices) {
      if (nextProps.record.prices[0].basePrice !== this.props.record.prices[0].basePrice) {
        this.setState({
          basePrice: nextProps.record.prices[0].basePrice,
        });
      }
      const priceData = nextProps.record.prices;
      const filteredPrices = priceData.filter((price) => {
        return (price.mileagePackage !== null);
      });
      const sortedPrices = filteredPrices.sort((a, b) => {
        return a.mileagePackage.id - b.mileagePackage.id;
      });
      this.setState({
        sortedPricesData: sortedPrices,
      });
    }
  }
  filterAndSortPricesData(prices) {
    const filteredPrices = prices.filter((price) => {
      return (price.mileagePackage !== null);
    });
    const sortedPrices = filteredPrices.sort((a, b) => {
      return a.mileagePackage.id - b.mileagePackage.id;
    });
    const publicId = get(this.props.record, 'publicId');
    this.setState({
      vehiclePublicId: publicId,
      sortedPricesData: sortedPrices,
      basePrice: sortedPrices[0].basePrice,
    });
  }
  handleMileagePackagePriceChange(e, index) {
    const tempState = this.state;
    tempState.sortedPricesData[index].mileagePackagePrice = e.target.value;
    this.setState(tempState);
  }
  handleBasePriceChange(e) {
    this.setState({
      basePrice: e.target.value,
    });
  }
  async handlePricesChange(vehiclePublicId) {
    const requestBody = {
      vehicleId: vehiclePublicId !== undefined ? vehiclePublicId : this.state.vehiclePublicId,
      newBasePrice: this.state.basePrice,
      mileagePackagePrices: this.state.sortedPricesData.map((data) => {
        return {
          mileagePackageId: data.mileagePackage.id,
          mileagePackagePrice: data.mileagePackagePrice,
        };
      })
    };
    await Api.post('/admin/vehicle/pricing/update', requestBody);
  }
  render() {
    return (
      <div className="prices-field">
        <div className="base-price-box">
          <div className="title"><h2>Base Price</h2></div>
          <div className="editable-section">
            <input type="number" value={this.state.basePrice} onChange={this.handleBasePriceChange} />
          </div>
        </div>
        <div className="mileage-package-box">
          {this.state.sortedPricesData !== null && this.state.sortedPricesData.map((data, index) => {
              return (
                <div key={data.mileagePackage.id}>
                  <div className="title">
                    <h2>{data.mileagePackage.displayName}</h2>
                  </div>
                  <div className="editable-section">
                    <input type="number" value={data.mileagePackagePrice} onChange={evt => this.handleMileagePackagePriceChange(evt, index)} />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }
}


VehiclePriceField.propTypes = {
  record: PropTypes.shape({
    prices: PropTypes.shape({
      basePrice: PropTypes.number,
    }),
  }),
  source: PropTypes.arrayOf(PropTypes.shape).isRequired,
};

VehiclePriceField.defaultProps = {
  record: {},
};

export default VehiclePriceField;
