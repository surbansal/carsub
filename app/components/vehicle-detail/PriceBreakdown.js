import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import NumberFormat from 'react-number-format';
import './VehicleSubscriptionOptionsComponent.scss';
import VehicleType from '../../types/VehicleType';
import MileagePackageType from '../../types/MileagePackageType';
import {Api} from '../../config/ApplicationContext';
import ZipCodeService from '../../services/api/ZipCodeService';

class PriceBreakdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentZipCode: null,
      monthlyBase: 0,
      mileagePackagePrice: 0,
      tax: 0,
      total: 0,
      taxRate: 0,
      zipCode: props.zipCode,
      mileagePackage: props.mileagePackage,
      vehicle: props.vehicle
    };
  }

  componentDidMount() {
    this.updateZipcodePricing();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      mileagePackage: nextProps.mileagePackage,
      zipCode: nextProps.zipCode
    }, this.updateZipcodePricing);
  }

  updateZipcodePricing() {
    let zipToUse = ZipCodeService.extractZipCode();
    if (this.state.zipCode) {
      zipToUse = this.state.zipCode;
    }
    if (zipToUse === this.state.currentZipCode) {
      this.calculatePrice();
      return;
    }
    this.setState({
      currentZipCode: zipToUse
    });
    Api.get(`/tax/zip/${zipToUse}`).then((resp) => {
      this.setState({
        taxRate: resp.estimatedCombinedRate
      }, () => {
        this.calculatePrice();
      });
    }).catch(() => {
      this.setState({
        taxRate: 0
      }, () => {
        this.calculatePrice();
      });
    });
  }

  calculatePrice() {
    const { taxRate, vehicle, mileagePackage } = this.state;
    const selectedPrice = vehicle.prices.find((price) => {
      if (price.mileagePackage && mileagePackage) {
        return price.mileagePackage.id === mileagePackage.id;
      }
      return price.mileagePackage === mileagePackage;
    });

    const monthlyBaseCost = selectedPrice.basePrice;
    const mileagePackageCost = selectedPrice.mileagePackagePrice;
    const subTotal = monthlyBaseCost + mileagePackageCost;
    const tax = (taxRate * subTotal);
    const total = subTotal + tax;
    const state = {
      monthlyBase: monthlyBaseCost,
      mileagePackagePrice: mileagePackageCost,
      tax,
      total
    };
    this.setState(state);
    if (this.props.priceUpdate) {
      this.props.priceUpdate(state);
    }
  }

  render() {
    let breakdown = <Fragment />;
    if (!this.props.totalOnly) {
      breakdown = (
        <Fragment>
          <div className="price-line-item">
            <div className="line-item-name">Monthly Base Price</div>
            <div className="line-item-price">
              <NumberFormat
                displayType="text"
                decimalScale={0}
                decimalSeparator=""
                value={Math.ceil(this.state.monthlyBase)}
                prefix="$"
              />
            </div>
          </div>
          <div className="price-line-item">
            <div className="line-item-name">Mileage Package</div>
            <div className="line-item-price">
              <NumberFormat
                displayType="text"
                decimalScale={0}
                decimalSeparator=""
                value={Math.ceil(this.state.mileagePackagePrice)}
                prefix="$"
              />
            </div>
          </div>
          <div className="price-line-item">
            <div className="line-item-name">Tax*</div>
            <div className="line-item-price">
              <NumberFormat
                displayType="text"
                decimalScale={0}
                decimalSeparator=""
                value={Math.ceil(this.state.tax)}
                prefix="$"
              />
            </div>
          </div>
          <hr />
        </Fragment>
      );
    }
    return (
      <Fragment>
        {breakdown}
        <div className="price-line-item">
          {this.props.totalOnly ? <Fragment /> : <div className="line-item-name total">Total</div> }

          <div className="line-item-price total">
            <NumberFormat
              displayType="text"
              decimalScale={0}
              decimalSeparator=""
              value={Math.ceil(this.state.total)}
              prefix="$"
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

PriceBreakdown.propTypes = {
  zipCode: PropTypes.string,
  vehicle: VehicleType.isRequired,
  mileagePackage: MileagePackageType,
  totalOnly: PropTypes.bool,
  priceUpdate: PropTypes.func
};

PriceBreakdown.defaultProps = {
  zipCode: null,
  mileagePackage: null,
  totalOnly: false,
  priceUpdate: null
};

export default PriceBreakdown;
