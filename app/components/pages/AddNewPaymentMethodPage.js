import React, {Component, Fragment} from 'react';
import {Elements, StripeProvider} from 'react-stripe-elements';
import PropTypes from 'prop-types';
import {stripeService} from '../../config/ApplicationContext';
import BreadcrumbComponent from '../BreadcrumbComponent';
import AddPaymentMethod from '../accounts/AddPaymentMethod';
import RequiresLogin from '../layout/RequiresLogin';
import './AddNewPaymentMethodPage.scss';
import MyAccountHeaderAndFooterPage from '../layout/MyAccountHeaderAndFooterPage';

class AddNewPaymentMethodPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stripePublicKey: null,
      userId: props.location.state.cardsData.userId
    };
  }

  componentDidMount() {
    stripeService.getPublicKey().then((stripePublicKey) => {
      this.setState({
        stripePublicKey
      });
    });
  }
  render() {
    if (!this.state.stripePublicKey) {
      return (
        <RequiresLogin redirectTo="/login">
          <div />
        </RequiresLogin>
      );
    }
    return (
      <RequiresLogin redirectTo="/login">
        <Fragment>
          <MyAccountHeaderAndFooterPage>
            <div className="add-payment-container">
              <BreadcrumbComponent text="Manage Payments" url="/manage-payment" />
              <h2>Add a New Card</h2>
              <StripeProvider apiKey={this.state.stripePublicKey}>
                <Elements>
                  <AddPaymentMethod userId={this.state.userId} />
                </Elements>
              </StripeProvider>
            </div>
          </MyAccountHeaderAndFooterPage>
        </Fragment>
      </RequiresLogin>
    );
  }
}

AddNewPaymentMethodPage.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape.isRequired
  }).isRequired
};

export default AddNewPaymentMethodPage;
