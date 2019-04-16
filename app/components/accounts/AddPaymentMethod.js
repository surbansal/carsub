import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {CardCVCElement, CardExpiryElement, CardNumberElement, injectStripe} from 'react-stripe-elements';
import amexLogo from '../../assets/images/americanexpress.png';
import discoverLogo from '../../assets/images/discover.png';
import mastercardLogo from '../../assets/images/mastercard.png';
import visaLogo from '../../assets/images/visa.png';
import './AddPaymentMethod.scss';
import {Api, integrationReportingService, logService, segmentAnalytics} from '../../config/ApplicationContext';
import * as SeverityType from '../../constants/SeverityType';

class AddPaymentMethod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBrand: null,
      isProcessing: false,
      defaultCheckboxSelected: false,
      errors: {
        creditCardNumber: false,
        creditCardNumberMessage: ''
      }
    };
    this.stripeStyle = {
      base: {
        color: '#0e368d',
        fontSize: '16px',
        lineHeight: 1.5
      }
    };
    this.onCardChange = this.onCardChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addCardDetails = this.addCardDetails.bind(this);
    this.parseErrors = this.parseErrors.bind(this);
    this.clearValidations = this.clearValidations.bind(this);
  }

  onCardChange(e) {
    this.setState({
      selectedBrand: e.brand === 'unknown' ? null : e.brand
    });
  }
  handleChange(e) {
    this.setState({
      defaultCheckboxSelected: e.target.checked
    });
  }
  async addCardDetails() {
    this.setState({
      isProcessing: true
    });
    this.clearValidations();
    try {
      const {token, error} = await this.props.stripe.createToken();
      if (error) {
        const {errors} = this.state;
        errors.creditCardNumber = true;
        errors.creditCardNumberMessage = 'Please enter valid card information to continue';
        this.setState({errors, isProcessing: false});
        logService.logErrors(`creditCardNumber - ${errors.creditCardNumberMessage} \n `, SeverityType.WARN, 'Validation Error', this.props.userId, null);
        return;
      }
      const request = {
        cardToken: token.id,
        defaultSelected: this.state.defaultCheckboxSelected
      };
      try {
        await Api.post('/user/payment-methods', request);
        this.setState({
          isProcessing: false
        });
        segmentAnalytics.track('Payment method added', {category: 'Add payment method'});
        this.props.history.push({
          pathname: '/manage-payment',
          search: 'notify=true',
          state: {detail: 'Card added successfully'}
        });
      } catch (response) {
        const errorData = await response.json();
        this.parseErrors(errorData);
        logService.logErrors(errorData.message, SeverityType.ERROR, 'System Error', this.props.userId, null);
      }
    } catch (e) {
      integrationReportingService.reportIntegrationError('STRIPE_FRONTEND', 'Non-validation error when attempting to integrate with stripe on manage payment component of the UI.');
    } finally {
      this.setState({isProcessing: false});
    }
  }

  parseErrors(data) {
    data.validationErrors.forEach((field) => {
      const errorsTemp = this.state.errors;
      errorsTemp[field.property] = true;
      const errorMessage = `${field.property}Message`;
      errorsTemp[errorMessage] = field.message;
      this.setState({
        errors: errorsTemp
      });
    });
  }

  clearValidations() {
    this.setState({
      errors: {
        creditCardNumber: false,
        creditCardNumberMessage: ''
      }
    });
  }

  render() {
    return (
      <div className="add-payment">
        <div className="add-payment-sections">
          <div className={`add-payment-section card-icons ${this.state.selectedBrand ? `selected ${this.state.selectedBrand}` : ''}`}>
            <div><img src={visaLogo} alt="Visa" className="visa-card right-space" /></div>
            <div><img src={mastercardLogo} alt="Master Card" className="mastercard-card right-space" /></div>
            <div><img src={discoverLogo} alt="Discover" className="discover-card right-space" /></div>
            <div><img src={amexLogo} alt="American Express" className="amex-card right-space" /></div>
          </div>
          <div className="add-payment-section">
            <label htmlFor="addCreditCardNumber">Credit Card Number</label>
            <CardNumberElement className="stripe-input" id="addCreditCardNumber" style={this.stripeStyle} onChange={this.onCardChange} />
          </div>
          <div className="add-payment-section">
            <div className="add-payment-inline">
              <div className="add-payment-expiration">
                <label htmlFor="addExpiration" className="expiration-label">Expiration <span className="sub-label">(MM/YY)</span></label>
                <CardExpiryElement className="stripe-input" id="addExpiration" style={this.stripeStyle} />
              </div>
              <div className="add-payment-cvc">
                <label htmlFor="addCvc">CVC</label>
                <CardCVCElement id="addCvc" className="stripe-input" style={this.stripeStyle} />
              </div>
            </div>
          </div>
          <div className="add-payment-section make-card-default-section">
            <input
              id="default-payment-method"
              type="checkbox"
              onChange={this.handleChange}
            />
            <div className="default-card-text small">Make this my Default Card.</div>
          </div>
          <div className="add-payment-section">
            <p className={ this.state.errors.creditCardNumber ? 'error-message' : 'hide-error'}>{ this.state.errors.creditCardNumberMessage }</p>
          </div>
          <div className="add-payment-section">
            <div className="action-field">
              <button className={this.state.isProcessing ? 'is-processing csa-button primary' : 'csa-button primary'} onClick={this.addCardDetails} disabled={this.state.isProcessing}>{this.state.isProcessing ? 'Updating...' : 'Save'}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

AddPaymentMethod.propTypes = {
  stripe: PropTypes.shape({
    createToken: PropTypes.func.isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  userId: PropTypes.string.isRequired
};

export default withRouter(injectStripe(AddPaymentMethod));
