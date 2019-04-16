import React, {Component, Fragment} from 'react';
import Moment from 'react-moment';
import {Link} from 'react-router-dom';
import BreadcrumbComponent from '../BreadcrumbComponent';
import {Api, segmentAnalytics} from '../../config/ApplicationContext';
import RequiresLogin from '../layout/RequiresLogin';
import './SubscriptionDetailsPage.scss';
import MyAccountHeaderAndFooterPage from '../layout/MyAccountHeaderAndFooterPage';

class SubscriptionDetailsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mileageAddOns: null,
      milesDisplayName: '',
      subscriptionLengthName: '',
      subscriptionTotalMiles: '',
      contractDownloadLocation: '',
      addOnsTotalMiles: '',
      totalMiles: '',
    };
  }

  componentDidMount() {
    Api.get('/subscription/mileage-add-ons').then((response) => {
      this.setState({
        mileageAddOns: response,
        addOnsTotalMiles: response.reduce((cnt, o) => { return cnt + o.miles; }, 0)
      });
    });
    Api.get('/subscription/current/contract').then((response) => {
      this.setState({
        contractDownloadLocation: response.location
      });
    });

    Api.get('/subscription/current').then((response) => {
      const miles = response.subscriptionOptions.mileageValue;
      const subscriptionLengthValue = response.subscriptionOptions.subscriptionLength.value;
      this.setState({
        milesDisplayName: response.subscriptionOptions.mileagePackage.displayName,
        subscriptionLengthName: `${response.subscriptionOptions.subscriptionLengthValue} +  months`,
        subscriptionTotalMiles: miles * subscriptionLengthValue,
        totalMiles: (miles * subscriptionLengthValue) + this.state.addOnsTotalMiles,
        subscriptionExpiryDate: response.subscriptionUsage.subscriptionEndDate
      });
    });
  }

  render() {
    if (!this.state.mileageAddOns) {
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
            <div className="subscription-details-container">
              <div className="subscription-details-content">
                <div>
                  <BreadcrumbComponent text="My Account" url="/my-account" />
                </div>
                <h2 className="subscription-details-label">Subscription Details</h2>
                <div className="expiration-date">
                  <span>Expiration Date</span>
                  <Moment date={this.state.subscriptionExpiryDate} format="MM/DD/YYYY" />
                </div>
                <div className="mileage-section">
                  <div className="subscription-miles-section">
                    <span>{this.state.milesDisplayName}</span>
                    <div className="subscription-miles">
                      <span>x {this.state.subscriptionLengthName}</span>
                      <span className="horizontal-line" />
                      <span className="subscription-total-miles">{this.state.subscriptionTotalMiles}</span>
                    </div>
                  </div>
                  {this.state.mileageAddOns.length !== 0 ? (
                    <div className="add-on-miles-section">
                      <span className="add-on-label">Add ons</span>
                      <div className="miles">
                        <span> Miles Added</span>
                        <span className="horizontal-line" />
                        <span className="add-ons-total-miles">{this.state.addOnsTotalMiles}</span>
                      </div>
                      <Link to="/add-ons" className="add-on-link">View all add-ons</Link>
                    </div>
                  ) : (<div />)}
                  <div className="total-miles-section">
                    <span>Total Miles</span>
                    <span className="horizontal-line" />
                    <span>{this.state.totalMiles}</span>
                  </div>
                  {this.state.contractDownloadLocation && (
                    <a className="contract-link" href={this.state.contractDownloadLocation} onClick={() => segmentAnalytics.track('Contract viewed', {category: 'Subscription Details interaction'})} target="_blank">
                      <span>View your contract (PDF)</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </MyAccountHeaderAndFooterPage>
        </Fragment>
      </RequiresLogin>
    );
  }
}

export default SubscriptionDetailsPage;
