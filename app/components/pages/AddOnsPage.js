import React, {Component, Fragment} from 'react';
import Moment from 'react-moment';
import {Api} from '../../config/ApplicationContext';
import BreadcrumbComponent from '../BreadcrumbComponent';
import RequiresLogin from '../layout/RequiresLogin';
import './AddOnsPage.scss';
import MyAccountHeaderAndFooterPage from '../layout/MyAccountHeaderAndFooterPage';

class AddOnsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mileageAddOns: null,
      addOnsTotalMiles: null
    };
  }
  componentDidMount() {
    Api.get('/subscription/mileage-add-ons').then((response) => {
      this.setState({
        mileageAddOns: response,
        addOnsTotalMiles: response.reduce((cnt, o) => { return cnt + o.miles; }, 0)
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
            <div className="add-ons-container">
              <div className="add-ons-content">
                <div className="mobile-breadcrumb">
                  <BreadcrumbComponent text="Subscription Details" url="/subscription-details" />
                </div>
                <div className="desktop-breadcrumb">
                  <BreadcrumbComponent text="My Account" url="/my-account" />
                </div>
                <h2>Add-Ons</h2>
                <div className="miles-list">
                  {this.state.mileageAddOns.map((addOns) => {
                    return (
                      <div key={addOns.id}>
                        <div className="miles-added">
                          <h2><Moment date={addOns.createdOn} format="MM/DD/YYYY" /> Miles Added</h2>
                          <h2 className="miles-value"><span>{addOns.miles}</span></h2>
                        </div>
                        <div className="mileage-package">
                          <h2>Mileage Package</h2>
                          <h2 className="package-value"><span>${addOns.paymentAmount}</span></h2>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="miles-added total-miles-added">
                  <h2>Total Miles Added</h2>
                  <h2 className="miles-value"><span>{this.state.addOnsTotalMiles}</span></h2>
                </div>
              </div>
            </div>
            <div className="call-us-container mobile-only">
              <div className="call-us-content">
                <span className="content">To purchase another Add-On, call:</span>
                <a href="tel:18003602228">1-800-360-2228</a>
              </div>

            </div>
          </MyAccountHeaderAndFooterPage>
        </Fragment>
      </RequiresLogin>
    );
  }
}

export default AddOnsPage;
