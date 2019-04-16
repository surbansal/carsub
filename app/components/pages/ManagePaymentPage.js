import {Link, withRouter} from 'react-router-dom';
import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Api} from '../../config/ApplicationContext';
import BreadcrumbComponent from '../BreadcrumbComponent';
import './ManagePaymentPage.scss';
import amex from '../../assets/images/americanexpress.png';
import discover from '../../assets/images/discover.png';
import masterCard from '../../assets/images/mastercard.png';
import visa from '../../assets/images/visa.png';
import RequiresLogin from '../layout/RequiresLogin';
import RemovePaymentMethodModal from '../modal/RemovePaymentMethodModal';
import MyAccountHeaderAndFooterPage from '../layout/MyAccountHeaderAndFooterPage';

class ManagePaymentPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddPrompt: false,
      cardsData: null,
      defaultCard: null,
      selectedCardForRemoval: null,
      isSelectedCardForRemovalDefault: false,
      cards: {
        'American Express': amex,
        Discover: discover,
        MasterCard: masterCard,
        Visa: visa
      },
      showNotification: false
    };
    this.startLongPress = this.startLongPress.bind(this);
    this.stopLongPress = this.stopLongPress.bind(this);
    this.removePaymentMethod = this.removePaymentMethod.bind(this);
    this.handleNo = this.handleNo.bind(this);
    this.checkLongPressOrClick = this.checkLongPressOrClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.presstimer = null;
  }
  componentDidMount() {
    Api.get('/user/payment-methods').then((response) => {
      this.filterResponse(response);
    });
    const params = new URLSearchParams(this.props.location.search);
    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      showNotification: params.get('notify') ? params.get('notify') : false
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.location.state.detail === 'Card deleted successfully') {
      Api.get('/user/payment-methods').then((response) => {
        this.filterResponse(response);
      });
    }
  }
  getCardImage(brand) {
    return this.state.cards[brand];
  }
  filterResponse(response) {
    const filteredDefaultCard = response.paymentMethodInfos.filter((data) => {
      return response.defaultSourceId === data.sourceId;
    });
    this.setState({
      cardsData: response,
      defaultCard: filteredDefaultCard
    });
  }
  startLongPress(e, data) {
    e.preventDefault();
    if (e.type === 'click' && e.button !== 0) {
      return;
    }
    const isDefaultCard = data.sourceId === this.state.defaultCard[0].sourceId;
    this.presstimer = setTimeout(() => {
      this.removePaymentMethod(isDefaultCard, data);
    }, 2000);
  }
  stopLongPress() {
    if (this.presstimer !== null) {
      clearTimeout(this.presstimer);
      this.presstimer = null;
    }
  }
  async removePaymentMethod(isDefaultCard, cardData) {
    await this.setState({
      isSelectedCardForRemovalDefault: isDefaultCard,
      selectedCardForRemoval: cardData,
      showAddPrompt: true
    });
  }
  checkLongPressOrClick() {
    if (this.presstimer !== null) {
      clearTimeout(this.presstimer);
      this.presstimer = null;
    }
  }
  handleSubmit() {
    const request = {
      cardToken: this.state.selectedCardForRemoval.sourceId,
    };
    Api.delete('/user/payment-methods', request).then(() => {
      this.props.history.push({
        pathname: '/manage-payment',
        search: 'notify=true',
        state: { detail: 'Card deleted successfully'}
      });
    });
    this.setState({ showAddPrompt: false });
  }
  handleNo() {
    this.setState({
      showAddPrompt: false,
      showNotification: false
    });
  }
  render() {
    if (!this.state.cardsData || !this.state.defaultCard) {
      return (
        <RequiresLogin redirectTo="/login">
          <div />
        </RequiresLogin>
      );
    }
    const cardAddedSuccessMessage = this.state.showNotification ? (
      <p className="success-message">{this.props.location.state.detail}</p>
    ) : null;
    return (
      <RequiresLogin redirectTo="/login">
        <Fragment>
          <RemovePaymentMethodModal
            showModal={this.state.showAddPrompt}
            handleSubmit={this.handleSubmit}
            handleNo={this.handleNo}
            isDefaultCard={this.state.isSelectedCardForRemovalDefault}
            selectedCardData={this.state.selectedCardForRemoval}
          />
          <MyAccountHeaderAndFooterPage>
            <div className="cards-container">
              <div className="cards-content">
                <BreadcrumbComponent text="My Account" url="/my-account" />
                {cardAddedSuccessMessage}
                <h2 className="medium">Manage Payments</h2>
                <div className="card-heading">
                  <h3 className="small">Default card</h3>
                  <h3 className="small">
                    <Link
                      to={{
                      pathname: '/update-payment-method',
                      state: {cardsData: this.state.cardsData, defaultCard: this.state.defaultCard}
                        }}
                      className="change-link"
                    >Change
                    </Link>
                  </h3>
                </div>
                <div className="payment-card">
                  <img src={this.getCardImage(this.state.defaultCard[0].brand)} alt="Visa" className="card-img" />
                  <div className="payment-info">
                    <p className="card-detail">{this.state.defaultCard[0].brand} Ending in {this.state.defaultCard[0].last4}</p>
                    <p className="card-expiry">Expires {this.state.defaultCard[0].expiryMonth}/{this.state.defaultCard[0].expiryYear.slice(-2)}</p>
                  </div>
                </div>
                <div className="card-heading">
                  <h3 className="small">Saved Cards</h3>
                  <h3 className="small">
                    <Link
                      to={{
                        pathname: '/add-payment-method',
                        state: {cardsData: this.state.cardsData}
                      }}
                      className="change-link"
                    >Add New
                    </Link>
                  </h3>
                </div>
                {this.state.cardsData.paymentMethodInfos.map((data) => {
                  return (
                    <div
                      key={data.sourceId}
                      id={data.sourceId}
                      className="payment-card saved-cards"
                      role="button"
                      tabIndex="-1"
                      onClick={this.checkLongPressOrClick}
                      onKeyDown={this.checkLongPressOrClick}
                      onMouseDown={(e) => { this.startLongPress(e, data); }}
                      onMouseOut={this.stopLongPress}
                      onBlur={this.stopLongPress}
                      onTouchStart={(e) => { this.startLongPress(e, data); }}
                      onTouchEnd={this.stopLongPress}
                      onTouchCancel={this.stopLongPress}
                    >
                      <img src={this.getCardImage(data.brand)} alt={data.brand} className="card-img" />
                      <div className="payment-info">
                        <p className="card-detail">{data.brand} Ending in {data.last4}</p>
                        <p className="card-expiry">Expires {data.expiryMonth}/{data.expiryYear.slice(-2)}</p>
                      </div>
                    </div>
                  );
                })
              }
              </div>
            </div>
          </MyAccountHeaderAndFooterPage>
        </Fragment>
      </RequiresLogin>
    );
  }
}

ManagePaymentPage.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    state: PropTypes.shape.isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired
};

export default withRouter(ManagePaymentPage);
