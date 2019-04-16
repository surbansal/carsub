import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CardCVCElement, CardExpiryElement, CardNumberElement, injectStripe} from 'react-stripe-elements';
import './PaymentInfoComponent.scss';
import VehicleType from '../../types/VehicleType';
import ValidationErrorType from '../../types/ValidationErrorType';
import AddressAutocompleteComponent from '../layout/AddressAutocompleteComponent';
import {Api, integrationReportingService, logService} from '../../config/ApplicationContext';
import AddressType from '../../types/AddressType';
import PriceBreakdown from './PriceBreakdown';
import SubscriptionHelperService from './SubscriptionHelperService';
import amexLogo from '../../assets/images/americanexpress.png';
import discoverLogo from '../../assets/images/discover.png';
import mastercardLogo from '../../assets/images/mastercard.png';
import visaLogo from '../../assets/images/visa.png';
import MileagePackageType from '../../types/MileagePackageType';
import * as SeverityType from '../../constants/SeverityType';

class PaymentInfoComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicle: props.vehicle,
      billingDetails: {
        billingAddress: {
          streetAddress2: '',
          streetAddress: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        isHomeAddress: true,
        hasAgreedToTerms: false,
        paymentToken: null,
        monthlyCost: 0
      },
      errors: {
        billingAddress: false,
        billingAddressMessage: '',
        hasAgreedToTerms: false,
        hasAgreedToTermsMessage: '',
        expiration: false,
        expirationMessage: '',
        cvc: false,
        cvcMessage: '',
        creditCardNumber: false,
        creditCardNumberMessage: ''
      },
      homeAddress: props.homeAddress || {},
      mileagePackage: props.mileagePackage,
      isSaving: false,
      selectedBrand: null
    };
    this.handleSubmitPaymentInfoClick = this.handleSubmitPaymentInfoClick.bind(this);
    this.handleBillingSameAsHomeCheckChanged = this.handleBillingSameAsHomeCheckChanged.bind(this);
    this.handleHasAgreedToTermsCheckChanged = this.handleHasAgreedToTermsCheckChanged.bind(this);
    this.handleValidations = this.handleValidations.bind(this);
    this.processPaymentAndComplete = this.processPaymentAndComplete.bind(this);
    this.clearValidations = this.clearValidations.bind(this);
    this.updatePrice = this.updatePrice.bind(this);
    this.onCardChange = this.onCardChange.bind(this);
    this.handleAddressChange = this.handleAddressChange.bind(this);
    this.handleAptNoChange = this.handleAptNoChange.bind(this);

    this.stripeStyle = {
      base: {
        color: '#0e368d',
        fontSize: '16px',
        lineHeight: 1.5
      }
    };
    this.expectedTotal = null;
  }

  componentDidMount() {
    SubscriptionHelperService.setIsSaving(this, false);
  }

  componentWillReceiveProps(nextProps) {
    const { billingDetails } = this.state;

    if (billingDetails.isHomeAddress) {
      billingDetails.billingAddress = nextProps.homeAddress;
    }

    this.setState({
      homeAddress: nextProps.homeAddress || {},
      billingDetails,
      mileagePackage: nextProps.mileagePackage
    });
    if (nextProps.subscriptionFailureResponse && this.props.subscriptionFailureResponse !== nextProps.subscriptionFailureResponse) {
      this.parseErrors(nextProps.subscriptionFailureResponse);
    }
  }


  onCardChange(e) {
    this.setState({
      selectedBrand: e.brand === 'unknown' ? null : e.brand
    });
  }

  handleHasAgreedToTermsCheckChanged() {
    const billingDetailsTemp = this.state.billingDetails;
    billingDetailsTemp.hasAgreedToTerms = !this.state.billingDetails.hasAgreedToTerms;

    const errorsTemp = this.state.errors;
    errorsTemp.hasAgreedToTerms = false;
    errorsTemp.hasAgreedToTermsMessage = '';

    this.setState({
      billingDetails: billingDetailsTemp,
      errors: errorsTemp
    });
  }

  handleBillingSameAsHomeCheckChanged() {
    const billingDetailsTemp = this.state.billingDetails;
    billingDetailsTemp.isHomeAddress = !this.state.billingDetails.isHomeAddress;
    if (billingDetailsTemp.isHomeAddress) {
      billingDetailsTemp.billingAddress = this.state.homeAddress;
    } else {
      billingDetailsTemp.billingAddress = {
        streetAddress2: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      };
    }
    this.setState({
      billingDetails: billingDetailsTemp
    });
  }

  handleSubmitPaymentInfoClick() {
    SubscriptionHelperService.setIsSaving(this, true);
    this.handleValidations();
  }

  processPaymentAndComplete() {
    const {billingDetails} = this.state;
    const cardData = {
      address_line1: billingDetails.billingAddress.streetAddress,
      address_city: billingDetails.billingAddress.city,
      address_state: billingDetails.billingAddress.state,
      address_zip: billingDetails.billingAddress.zipCode,
      address_country: billingDetails.billingAddress.country
    };
    this.props.stripe.createToken(cardData).then(({token, error}) => {
      if (error) {
        const stripeClientError = {
          validationErrors: [{
            property: 'creditCardNumber',
            message: 'Please enter valid card information to continue'
          }]
        };
        this.parseErrors(stripeClientError);
        return;
      }
      billingDetails.paymentToken = token.id;
      billingDetails.monthlyCost = this.expectedTotal;
      if (token) {
        this.props.onComplete({
          billingDetails
        });
      }
    }).catch(() => {
      integrationReportingService.reportIntegrationError('STRIPE_FRONTEND', 'Non-validation error when attempting to integrate with stripe on the payment component UI.');
    });
  }

  updatePrice(priceBreakdown) {
    this.expectedTotal = priceBreakdown.total;
  }

  parseErrors(data) {
    SubscriptionHelperService.setIsSaving(this, false);
    let logMessage;
    let logSeverity;
    let logCategory;
    if (data.validationErrors) {
      logSeverity = SeverityType.WARN;
      logCategory = 'Validation Error';
      data.validationErrors.forEach((field) => {
        const errorsTemp = this.state.errors;
        if (errorsTemp[field.property]) {
          errorsTemp[field.property] = true;
          const errorMessage = `${field.property}Message`;
          errorsTemp[errorMessage] = field.message;
        } else {
          errorsTemp.otherMessages = errorsTemp.otherMessages ? `${errorsTemp.otherMessages}, ${field.message}` : `${field.message}`;
        }
        logMessage = (logMessage) ? `${logMessage}${field.property} - ${field.message} \n ` : `${field.property} - ${field.message} \n `;
        this.setState({errors: errorsTemp});
      });
    } else {
      // This is 500 server error scenario
      logSeverity = SeverityType.ERROR;
      logMessage = data.message;
      logCategory = 'System Error';
    }
    logService.logErrors(logMessage, logSeverity, logCategory, null, this.props.leadsData.publicId);
  }

  handleAddressChange(selectedAddress) {
    const aptNo = this.state.billingDetails.billingAddress.streetAddress2;
    const {billingDetails, errors} = this.state;

    billingDetails.billingAddress = selectedAddress.selectedAddress;
    billingDetails.billingAddress.streetAddress2 = aptNo;
    errors.billingAddress = false;
    errors.billingAddress = '';
    this.setState({
      billingDetails,
      errors
    });
  }
  handleAptNoChange(e) {
    const {billingDetails} = this.state;
    billingDetails.billingAddress.streetAddress2 = e.target.value;
    this.setState({
      billingDetails
    });
  }
  handleValidations() {
    const {billingDetails} = this.state;
    Api.post('/subscription/validate/billingDetails', billingDetails).then(() => {
      this.clearValidations();
      this.processPaymentAndComplete();
    }).catch((response) => {
      response.json().then(data => this.parseErrors(data));
    });
  }


  clearValidations() {
    this.setState({
      errors: {
        billingAddress: false,
        billingAddressMessage: '',
        hasAgreedToTerms: false,
        hasAgreedToTermsMessage: '',
        otherMessages: null
      }
    });
  }


  render() {
    if (!this.state.vehicle) {
      return null;
    }

    const homeAddressContent = this.state.billingDetails.isHomeAddress && this.state.homeAddress ?
      (
        <div className="home-address">
          {this.state.homeAddress.streetAddress}<br />
          {this.state.homeAddress.streetAddress2 &&
            <span>{this.state.homeAddress.streetAddress2}<br /></span>
          }
          {this.state.homeAddress.city}, {this.state.homeAddress.state} {this.state.homeAddress.zipCode}
        </div>
      ) : null;

    const billingAddressContent = !this.state.billingDetails.isHomeAddress ?
      (
        <div>
          <AddressAutocompleteComponent id="billingAddress" onSelect={this.handleAddressChange} />
          <div className="appartment-field">
            <label htmlFor="appartmentNo">Apt, Suite, Bldg. (Optional)</label>
            <input id="appartmentNo" type="text" value={this.state.billingDetails.billingAddress.streetAddress2} onChange={this.handleAptNoChange} />
          </div>
        </div>
      ) : null;


    return (
      <div className="subscribe-step">
        <div className="subscribe-step-details">
          <h2 className="subscription-step-heading">Payment Information</h2>
          <label htmlFor="creditCardNumber" className="subscribe-step-label">Credit Card Number</label>
          <CardNumberElement className="stripe-input" id="creditCardNumber" style={this.stripeStyle} onChange={this.onCardChange} />
        </div>
        <div className="subscribe-step-details">
          <div className="subscribe-step-inline">
            <div className="subscribe-step-expiration">
              <label htmlFor="expiration" className="subscribe-step-label">Expiration <span className="sub-label">(MM/YY)</span></label>
              <CardExpiryElement className="stripe-input" id="expiration" style={this.stripeStyle} />
            </div>
            <div className="subscribe-step-cvc">
              <label htmlFor="cvc" className="subscribe-step-label">CVC</label>
              <CardCVCElement id="cvc" className="stripe-input" style={this.stripeStyle} />
            </div>
          </div>
          <p className={ this.state.errors.creditCardNumber ? 'error-message' : 'hide-error'}>{ this.state.errors.creditCardNumberMessage }</p>
        </div>
        <div className={`subscribe-step-details card-icons ${this.state.selectedBrand ? `selected ${this.state.selectedBrand}` : ''}`}>
          <img src={visaLogo} alt="Visa" className="visa-card" />
          <img src={mastercardLogo} alt="Master Card" className="mastercard-card" />
          <img src={discoverLogo} alt="Discover" className="discover-card" />
          <img src={amexLogo} alt="American Express" className="amex-card" />
        </div>
        <div className="subscribe-step-details">
          <h3>Billing Address</h3>
          {billingAddressContent}
          <div className="same-address-container">
            <input
              id="billing-same-as-home-address"
              type="checkbox"
              checked={this.state.billingDetails.isHomeAddress}
              onChange={this.handleBillingSameAsHomeCheckChanged}
            />
            <label htmlFor="billing-address">Billing address same as home address</label>
            {homeAddressContent}
          </div>
          <hr className="hide payment-option-partition" />
          <p className={ this.state.errors.billingAddress ? 'error-message' : 'hide-error'}>{ this.state.errors.billingAddressMessage }</p>
        </div>

        <div className="subscribe-step-details">
          <PriceBreakdown vehicle={this.state.vehicle} mileagePackage={this.state.mileagePackage} zipCode={this.state.homeAddress.zipCode} priceUpdate={this.updatePrice} />
        </div>

        <div className="subscribe-step-details">
          <div className="agree-to-terms-container">
            <hr />
            <input
              id="agree-to-terms"
              type="checkbox"
              checked={this.state.billingDetails.hasAgreedToTerms}
              onChange={this.handleHasAgreedToTermsCheckChanged}
            />
            <label htmlFor="agree-to-terms">I agree to the <a href="/terms-and-conditions" target="_blank">terms &amp; conditions</a>, <a href="/privacy-policy" target="_blank">privacy policy</a> and authorize AAA to charge my credit card.</label>
          </div>
          <p className={ this.state.errors.hasAgreedToTerms ? 'error-message' : 'hide-error'}>{ this.state.errors.hasAgreedToTermsMessage }</p>
        </div>

        <div className="subscribe-step-details">
          <div className="fine-print">
            <p>You will not be charged until AAA has confirmed your eligibility for a car subscription.</p>
          </div>
        </div>
        <div className="subscribe-step-details">
          <p className={this.state.errors.otherMessages ? 'error-message' : 'hide-error'}>{this.state.errors.otherMessages}</p>
          <div className="submit-options">
            <button className="csa-button primary" disabled={this.state.isSaving} onClick={ this.handleSubmitPaymentInfoClick }>Reserve My Car</button>
          </div>
        </div>
      </div>
    );
  }
}

PaymentInfoComponent.propTypes = {
  vehicle: VehicleType.isRequired,
  leadsData: PropTypes.shape({
    publicId: PropTypes.string.isRequired
  }).isRequired,
  onComplete: PropTypes.func.isRequired,
  homeAddress: AddressType,
  mileagePackage: MileagePackageType,
  stripe: PropTypes.shape({
    createToken: PropTypes.func.isRequired
  }).isRequired,
  subscriptionFailureResponse: ValidationErrorType,
  // eslint-disable-next-line react/no-unused-prop-types
  onSaving: PropTypes.func.isRequired
};

PaymentInfoComponent.defaultProps = {
  homeAddress: null,
  mileagePackage: null,
  subscriptionFailureResponse: null
};

export default injectStripe(PaymentInfoComponent);
