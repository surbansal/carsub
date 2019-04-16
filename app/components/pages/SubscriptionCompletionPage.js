import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {Element, scroller} from 'react-scroll';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';
import './MessagingPage.scss';
import {Api, ContentfulService} from '../../config/ApplicationContext';
import SubscriptionVehicle from '../subscription/SubscriptionVehicle';
import './SubscriptionCompletionPage.scss';
import ConfirmationBreakdown from '../subscription/ConfirmationBreakdown';

class SubscriptionCompletionPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null,
      subscriptionInfo: props.location.state.subscription
    };
  }

  componentDidMount() {
    ContentfulService.getEntries({'sys.id': 'GZMaCcTK48CgyS8oYUaMQ'}).then((resp) => {
      this.setState({
        content: resp.items[0].fields,
      });
    });

    if (!this.state.subscriptionInfo || !this.state.subscriptionInfo.vehicle || !this.state.subscriptionInfo.firstName) {
      const params = new URLSearchParams(this.props.location.search);
      Api.get(`/subscription?id=${params.get('subscription')}&verification=${params.get('verification')}`).then((response) => {
        this.setState({
          subscriptionInfo: response
        });
      });
    }
  }

  // eslint-disable-next-line class-methods-use-this
  handleScrollToNextSteps(event) {
    event.preventDefault();
    scroller.scrollTo('next-steps', {
      duration: 800,
      delay: 0,
      smooth: 'easeInOutQuart'
    });
  }

  render() {
    const { subscriptionInfo} = this.state;
    const subscription = this.state.content;
    if (!subscriptionInfo || !subscription) {
      return <div />;
    }
    return (
      <HeaderAndFooterPage>
        <div className="messaging-page subscription-approval">
          <div className="header-info">
            <h1>Congratulations {subscriptionInfo.firstName}, your registration is complete!</h1>
          </div>
          <div className="finish-setup">
            <Link to="/" onClick={this.handleScrollToNextSteps}>What to expect next</Link>
          </div>
          <div className="messaging-content-completion">
            <SubscriptionVehicle vehicle={subscriptionInfo.vehicle}>
              <ConfirmationBreakdown subscription={subscriptionInfo} />
            </SubscriptionVehicle>
            <div className="approval-steps-container">
              <Element name="next-steps">
                <div className="approval-steps">
                  <div className="user-account">
                    <h2>{subscription.nextStepsHeader}</h2>
                    {subscription.nextSteps.map((category) => {
                      return (
                        <div key={category.sys.id}>
                          <h3>{category.fields.title}</h3>
                          <p>{category.fields.description}</p>
                        </div>);
                    })}
                    <h3>Questions? </h3>
                    <div><Link to="/faqs">Visit Our Faqs</Link></div>
                    <h3> Email us at </h3>
                    <div><a href="mailto:carsubscription@norcal.aaa.com">carsubscription@norcal.aaa.com</a></div>
                  </div>
                </div>
              </Element>
            </div>
          </div>
        </div>
      </HeaderAndFooterPage>
    );
  }
}

SubscriptionCompletionPage.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired,
    state: PropTypes.shape.isRequired
  }).isRequired
};

export default SubscriptionCompletionPage;
