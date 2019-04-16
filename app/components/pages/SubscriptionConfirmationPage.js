import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';
import './MessagingPage.scss';
import './SubscriptionConfirmationPage.scss';
import {Api, ContentfulService, contractService} from '../../config/ApplicationContext';
import SubscriptionVehicle from '../subscription/SubscriptionVehicle';
import ConfirmationBreakdown from '../subscription/ConfirmationBreakdown';

class SubscriptionConfirmationPage extends Component {
  constructor() {
    super();
    this.state = {
      content: {},
      subscriptionInfo: {}
    };
    this.signContract = this.signContract.bind(this);
  }

  componentDidMount() {
    const params = new URLSearchParams(this.props.location.search);
    Api.get(`/subscription?id=${params.get('subscription')}&verification=${params.get('verification')}`).then((response) => {
      if (response.status === 'CONFIRMED') {
        this.props.history.push({
          pathname: '/subscription-completion',
          search: `subscription=${params.get('subscription')}&verification=${params.get('verification')}`,
          state: { subscription: this.state.subscriptionInfo }
        });
      } else if (response.status === 'APPROVED') {
        if (response.contract) {
          contractService.getContractStatus(response.contract.contractId).then((contractInfo) => {
            if (contractInfo.contractStatus === 'COMPLETED') {
              this.props.history.push({
                pathname: '/approval',
                search: `subscription=${params.get('subscription')}&verification=${params.get('verification')}`
              });
            }
          });
        }
      }
      this.setState({ subscriptionInfo: response });
    });
    ContentfulService.getEntry('51o3BIEiTuQqSqU2wK8wOe').then((resp) => {
      this.setState({
        content: resp.fields
      });
    });
  }

  signContract() {
    const params = new URLSearchParams(this.props.location.search);
    const subscriptionId = params.get('subscription');
    const verificationCode = params.get('verification');
    Api.get(`/subscription?id=${subscriptionId}&verification=${verificationCode}`).then((response) => {
      contractService.generateSignUrl(response.contract.contractId, subscriptionId, verificationCode).then((signUrl) => {
        window.location.assign(signUrl);
      });
    });
  }

  render() {
    let header;
    const {
      content,
      subscriptionInfo
    } = this.state;
    if (!subscriptionInfo || !subscriptionInfo.vehicle) {
      return <div />;
    }
    if (subscriptionInfo.status === 'APPROVED') {
      header = (
        <div className="header-info">
          <h1>{content.approvedHeader}</h1>
          <h3>{content.approvedMessage}
            &nbsp;
          </h3>
          <div className="account-setup-btn">
            <button className="csa-button primary" onClick={this.signContract}>{content.createAccountButtonText}</button>
          </div>
        </div>
      );
    } else if (subscriptionInfo.status === 'DENIED') {
      header = (
        <div className="header-info">
          <h1>{content.deniedHeader}</h1>
          <h3>{content.deniedMessage}</h3>
        </div>
      );
    } else {
      header = (
        <div className="header-info">
          <h1>{content.pendingHeader}</h1>
          <h3>{content.pendingMessage}</h3>
        </div>
      );
    }
    return (
      <HeaderAndFooterPage>
        <div className="messaging-page subscription-confirmation">
          {header}
          <div className="messaging-content">
            <SubscriptionVehicle vehicle={subscriptionInfo.vehicle}>
              <ConfirmationBreakdown subscription={subscriptionInfo} />
            </SubscriptionVehicle>
          </div>
          <div className="messaging-email">
            <h3>Questions? </h3>
            <div><Link to="/faqs">Visit Our Faqs</Link></div>
            <h3> Email us at </h3>
            <div><a href="mailto:carsubscription@norcal.aaa.com">carsubscription@norcal.aaa.com</a></div>
          </div>
        </div>
      </HeaderAndFooterPage>
    );
  }
}

SubscriptionConfirmationPage.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(SubscriptionConfirmationPage);
