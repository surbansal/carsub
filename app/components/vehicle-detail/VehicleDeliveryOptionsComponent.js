import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './VehicleDeliveryOptionsComponent.scss';
import VehicleType from '../../types/VehicleType';
import TimeFrameSelectorComponent from './TimeFrameSelectorComponent';
import DaySelectorComponent from './DaySelectorComponent';
import AddressAutocompleteComponent from '../layout/AddressAutocompleteComponent';
import {Api, logService} from '../../config/ApplicationContext';
import AddressType from '../../types/AddressType';
import SubscriptionHelperService from './SubscriptionHelperService';
import * as SeverityType from '../../constants/SeverityType';

class VehicleDeliveryOptionsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicle: props.vehicle,
      deliveryOptions: {
        deliveryDate: '',
        deliveryTimeFrameType: '',
        deliveryAddress: {
          streetAddress2: '',
          streetAddress: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        isHomeAddress: true
      },
      errors: {
        deliveryDate: false,
        deliveryDateMessage: '',
        deliveryTimeFrame: false,
        deliveryTimeFrameMessage: '',
        deliveryAddress: false,
        deliveryAddressMessage: ''
      },
      homeAddress: props.homeAddress,
      isSaving: false
    };
    this.handleSubmitDeliveryOptionsClick = this.handleSubmitDeliveryOptionsClick.bind(this);
    this.handleDeliverToHomeCheckChanged = this.handleDeliverToHomeCheckChanged.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleAptNoChange = this.handleAptNoChange.bind(this);
    this.clearValidations = this.clearValidations.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { deliveryOptions } = this.state;
    if (this.state.deliveryOptions.isHomeAddress) {
      deliveryOptions.deliveryAddress = nextProps.homeAddress;
    }
    this.setState({
      homeAddress: nextProps.homeAddress,
      deliveryOptions
    });
  }
  getDayData(data) {
    const deliveryOptionsTemp = this.state.deliveryOptions;
    deliveryOptionsTemp.deliveryDate = data;
    this.setState({
      deliveryOptions: deliveryOptionsTemp
    });
    const errorsTemp = this.state.errors;
    errorsTemp.deliveryDate = false;
    errorsTemp.deliveryDateMessage = '';
    this.setState({
      errors: errorsTemp
    });
  }
  getTimeData(data) {
    const deliveryOptionsTemp = this.state.deliveryOptions;
    deliveryOptionsTemp.deliveryTimeFrame = data;
    deliveryOptionsTemp.deliveryTimeFrameDisplayName = data.displayName;
    this.setState({
      deliveryOptions: deliveryOptionsTemp
    });
    const errorsTemp = this.state.errors;
    errorsTemp.deliveryTimeFrame = false;
    errorsTemp.deliveryTimeFrameMessage = '';
    this.setState({
      errors: errorsTemp
    });
  }
  deliveryOptionLead() {
    SubscriptionHelperService.setIsSaving(this, true);
    Api.post(`/subscription/leads/${this.props.leadsData.publicId}/delivery-options`, this.state.deliveryOptions).then((response) => {
      SubscriptionHelperService.setIsSaving(this, false); this.clearValidations();
      this.props.onComplete({
        deliveryOptions: response
      });
    }).catch((response) => {
      SubscriptionHelperService.setIsSaving(this, false);
      response.json().then((data) => {
        let logMessage;
        let logSeverity;
        let logCategory;
        if (data.validationErrors) {
          logSeverity = SeverityType.WARN;
          logCategory = 'Validation Error';
          data.validationErrors.map((field) => {
            const errorsTemp = this.state.errors;
            errorsTemp[field.property] = true;
            const errorMessage = `${field.property}Message`;
            logMessage = (logMessage) ? `${logMessage}${field.property} - ${field.message} \n ` : `${field.property} - ${field.message} \n `;
            errorsTemp[errorMessage] = field.message;
            this.setState({
              errors: errorsTemp
            });
            return null;
          });
        } else {
          // This is 500 server error scenario
          logSeverity = SeverityType.ERROR;
          logMessage = data.message;
          logCategory = 'System Error';
        }
        logService.logErrors(logMessage, logSeverity, logCategory, null, this.props.leadsData.publicId);
      });
    });
  }
  handleDeliverToHomeCheckChanged() {
    const deliveryOptionsTemp = this.state.deliveryOptions;
    deliveryOptionsTemp.isHomeAddress = !this.state.deliveryOptions.isHomeAddress;
    const errorsTemp = this.state.errors;
    errorsTemp.deliveryAddress = false;
    errorsTemp.deliveryAddress = '';
    if (deliveryOptionsTemp.isHomeAddress) {
      deliveryOptionsTemp.deliveryAddress = this.state.homeAddress;
    } else {
      deliveryOptionsTemp.deliveryAddress = {
        streetAddress2: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      };
    }
    this.setState({
      deliveryOptions: deliveryOptionsTemp,
      errors: errorsTemp
    });
  }

  handleSubmitDeliveryOptionsClick() {
    this.deliveryOptionLead();
  }
  clearValidations() {
    this.setState({
      errors: {
        deliveryDate: false,
        deliveryDateMessage: '',
        deliveryTimeFrame: false,
        deliveryTimeFrameMessage: '',
        deliveryAddress: false,
        deliveryAddressMessage: ''
      }
    });
  }
  handleAddressChange(selectedAddress) {
    const aptNo = this.state.deliveryOptions.deliveryAddress.streetAddress2;
    const deliveryOptionsTemp = {
      deliveryDate: this.state.deliveryOptions.deliveryDate,
      deliveryTimeFrame: this.state.deliveryOptions.deliveryTimeFrame,
      deliveryAddress: {
        streetAddress2: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      isHomeAddress: false
    };
    deliveryOptionsTemp.deliveryAddress = selectedAddress.selectedAddress;
    deliveryOptionsTemp.deliveryAddress.streetAddress2 = aptNo;
    const errorsTemp = this.state.errors;
    errorsTemp.deliveryAddress = false;
    errorsTemp.deliveryAddress = '';
    this.setState({
      deliveryOptions: deliveryOptionsTemp,
      errors: errorsTemp
    });
  }
  handleAptNoChange(e) {
    const deliveryOptionsTemp = {
      deliveryDate: this.state.deliveryOptions.deliveryDate,
      deliveryTimeFrame: this.state.deliveryOptions.deliveryTimeFrame,
      deliveryAddress: this.state.deliveryOptions.deliveryAddress,
      isHomeAddress: false
    };
    deliveryOptionsTemp.deliveryAddress.streetAddress2 = e.target.value;
    this.setState({
      deliveryOptions: deliveryOptionsTemp,
    });
  }
  render() {
    if (!this.state.vehicle) {
      return null;
    }
    const homeAddressContent = this.state.deliveryOptions.isHomeAddress && this.state.homeAddress ?
      (
        <div className="home-address">
          {this.state.homeAddress.streetAddress}<br />
          {this.state.homeAddress.streetAddress2 &&
            <span>{this.state.homeAddress.streetAddress2}<br /></span>
          }
          {this.state.homeAddress.city}, {this.state.homeAddress.state} {this.state.homeAddress.zipCode}
        </div>
      ) : null;

    const deliveryAddressContent = !this.state.deliveryOptions.isHomeAddress ?
      (
        <div>
          <AddressAutocompleteComponent id="deliveryAddress" onSelect={this.handleAddressChange} />
          <div className="appartment-field">
            <label htmlFor="appartmentNo">Apt, Suite, Bldg. (Optional)</label>
            <input id="appartmentNo" type="text" value={this.state.deliveryOptions.deliveryAddress.streetAddress2} onChange={this.handleAptNoChange} />
          </div>
        </div>
      ) : null;


    return (
      <div className="subscribe-step">
        <div className="subscribe-step-details delivery-options">
          <h2 className="subscription-step-heading"> Delivery Options</h2>
          <label htmlFor="delivery-date">Select Date</label>
          <div className="delivery-date-mobile">
            {this.props.displayDeliveryDayOptions ? <DaySelectorComponent deliveryOptions={this.state.deliveryOptions} deliveryDays={this.props.subscriptionOptions.deliveryDays} id="delivery-date" className="day-selector" sendData={(val) => { this.getDayData(val); }} /> : <div />}
          </div>
          <p className={this.state.errors.deliveryDate ? 'error-message' : 'hide-error'}>{this.state.errors.deliveryDateMessage}</p>
        </div>
        <div className="subscribe-step-details">
          <label htmlFor="delivery-time">Select Timeframe</label>
          <TimeFrameSelectorComponent id="delivery-time" timeFrameOptions={this.props.subscriptionOptions.timeFrames} sendData={ (val) => { this.getTimeData(val); } } />
          <p className={ this.state.errors.deliveryTimeFrame ? 'error-message' : 'hide-error'}>{ this.state.errors.deliveryTimeFrameMessage }</p>
        </div>
        <div className="subscribe-step-details">
          <h3>Delivery Address</h3>
          {deliveryAddressContent}
          <div className="same-address-container">
            <input
              id="deliver-to-home-address"
              type="checkbox"
              name="dayTime"
              checked={this.state.deliveryOptions.isHomeAddress}
              onChange={this.handleDeliverToHomeCheckChanged}
            />
            <label htmlFor="deliver-to-home-address">Deliver to my home address</label>
            {homeAddressContent}
          </div>
        </div>
        <div className="subscribe-step-details">
          <p className={ this.state.errors.deliveryAddress ? 'error-message' : 'hide-error'}>{ this.state.errors.deliveryAddressMessage }</p>
        </div>
        <div className="subscribe-step-details">
          <div className="submit-options">
            <button className="csa-button primary" disabled={this.state.isSaving} onClick={ this.handleSubmitDeliveryOptionsClick }>Submit Delivery Preferences</button>
          </div>
          <div className="fine-print">
            <p>You will not be charged until the final step</p>
          </div>
        </div>
      </div>
    );
  }
}

VehicleDeliveryOptionsComponent.propTypes = {
  displayDeliveryDayOptions: PropTypes.bool.isRequired,
  vehicle: VehicleType.isRequired,
  leadsData: PropTypes.shape({
    publicId: PropTypes.string.isRequired
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  homeAddress: AddressType,
  // eslint-disable-next-line react/no-unused-prop-types
  onSaving: PropTypes.func.isRequired,
  subscriptionOptions: PropTypes.shape({
    timeFrames: PropTypes.arrayOf(PropTypes.shape),
    deliveryDays: PropTypes.arrayOf(PropTypes.shape)
  }).isRequired
};

VehicleDeliveryOptionsComponent.defaultProps = {
  homeAddress: null
};

export default VehicleDeliveryOptionsComponent;
