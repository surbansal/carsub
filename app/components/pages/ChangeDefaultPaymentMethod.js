import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import {Api, logService, segmentAnalytics} from '../../config/ApplicationContext';
import BreadcrumbComponent from '../BreadcrumbComponent';
import './ManagePaymentPage.scss';
import './ChangeDefaultPaymentMethod.scss';
import amex from '../../assets/images/americanexpress.png';
import discover from '../../assets/images/discover.png';
import masterCard from '../../assets/images/mastercard.png';
import visa from '../../assets/images/visa.png';
import * as SeverityType from '../../constants/SeverityType';
import MyAccountHeaderAndFooterPage from '../layout/MyAccountHeaderAndFooterPage';

class ChangeDefaultPaymentMethod extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentMethodInfos: props.location.state.cardsData.paymentMethodInfos,
      updatedDefaultSourceToken: props.location.state.defaultCard[0].sourceId,
      failure: false,
      isProcessing: false,
      cards: {
        'American Express': amex,
        Discover: discover,
        MasterCard: masterCard,
        Visa: visa
      }
    };
    this.handleChange = this.handleChange.bind(this);
    this.updateDefaultPaymentMethod = this.updateDefaultPaymentMethod.bind(this);
  }
  getCardImage(brand) {
    return this.state.cards[brand];
  }
  updateDefaultPaymentMethod() {
    const requestBody = {
      cardToken: this.state.updatedDefaultSourceToken,
    };
    this.setState({
      isProcessing: true
    });
    Api.post('/user/payment-methods/default', requestBody).then(() => {
      this.setState({
        failure: false,
        isProcessing: false
      });
      segmentAnalytics.track('Payment method updated', {category: 'Update payment method'});
      this.props.history.push({
        pathname: '/manage-payment',
        search: 'notify=true',
        state: { detail: 'Card updated successfully'}
      });
    }).catch((response) => {
      response.json().then((data) => {
        this.setState({
          failure: true,
          isProcessing: false,
        });
        logService.logErrors(data.message, SeverityType.ERROR, 'System Error', this.props.location.state.cardsData.userId, null);
      });
    });
  }
  handleChange(event) {
    this.setState({
      updatedDefaultSourceToken: event.currentTarget.id
    });
  }
  render() {
    const cardFailureMessage = this.state.failure ? (
      <p className="error-message">Unable to update card</p>
    ) : null;
    return (
      <Fragment>
        <MyAccountHeaderAndFooterPage>
          <div className="cards-container change-payment-method">
            <div className="cards-content">
              <BreadcrumbComponent text="Manage Payments" url="/manage-payment" />
              {cardFailureMessage}
              <h2>Change Default Card</h2>
              {this.state.paymentMethodInfos.map((data) => {
                  return (
                    <div id={data.sourceId} key={data.sourceId} onChange={this.handleChange} onClick={this.handleChange} onKeyDown={this.handleChange} role="presentation" className={this.state.updatedDefaultSourceToken === data.sourceId ? 'payment-card saved-cards selected' : 'payment-card saved-cards'}>
                      <img src={this.getCardImage(data.brand)} alt={data.brand} className="card-img" />
                      <div className="payment-info">
                        <p className="card-detail">{data.brand} Ending in {data.last4}</p>
                        <p className="card-expiry">Expires {data.expiryMonth}/{data.expiryYear.slice(-2)}</p>
                      </div>
                    </div>
                  );
                })
              }
              <div className="add-payment-section">
                <div className="action-field center">
                  <Link
                    to={{
                      pathname: '/add-payment-method',
                      state: {cardsData: this.props.location.state.cardsData}
                    }}
                    className="change-link"
                  >Add a New Card
                  </Link>
                </div>
                <div className="action-field">
                  <button className={this.state.isProcessing ? 'is-processing csa-button primary' : 'csa-button primary'} onClick={this.updateDefaultPaymentMethod} disabled={this.state.isProcessing || (this.props.location.state.defaultCard[0].sourceId === this.state.updatedDefaultSourceToken)}>{this.state.isProcessing ? 'Updating...' : 'Save'}</button>
                </div>
              </div>
            </div>
          </div>
        </MyAccountHeaderAndFooterPage>
      </Fragment>
    );
  }
}

ChangeDefaultPaymentMethod.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape.isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};
export default ChangeDefaultPaymentMethod;
