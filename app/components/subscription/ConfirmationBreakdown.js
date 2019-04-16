import React, {Component} from 'react';
import Moment from 'react-moment';
import BaseSubscriptionType from '../../types/BaseSubscriptionType';
import './ConfirmationBreakdown.scss';

class ConfirmationBreakdown extends Component {
  componentDidMount() {
  }

  render() {
    const {subscription} = this.props;
    const mileagePackageValue = subscription.subscriptionOptions.mileagePackage.unit === 'UNLIMITED_MILES' ? 'Unlimited' : `${subscription.subscriptionOptions.mileagePackage.value} miles`;
    return (
      <div className="confirmation-breakdown">
        <div className="confirmation-info">
          <label htmlFor="delivery-info">
            Delivery Date & Time Requested
          </label>
          <h2 id="delivery-info">
            <Moment date={subscription.deliveryDate} format="MMMM Do" />, {subscription.deliveryTimeFrame.displayName}
          </h2>
        </div>
        <div className="confirmation-info">
          <label htmlFor="mileage-package">
            Mileage Package Per Month
          </label>
          <h2 id="mileage-package">
            {mileagePackageValue}
          </h2>
        </div>
        <div className="confirmation-info">
          <label htmlFor="mileage-package">
            Length Of Subscription
          </label>
          <h2 id="mileage-package">
            {subscription.subscriptionOptions.subscriptionLengthValue} months
          </h2>
        </div>
      </div>
    );
  }
}

ConfirmationBreakdown.propTypes = {
  subscription: BaseSubscriptionType.isRequired
};

export default ConfirmationBreakdown;
