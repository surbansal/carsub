import React, {Component} from 'react';
import {Link, NavLink} from 'react-router-dom';
import PropTypes from 'prop-types';
import emergencyAssistance from '../../assets/images/emergency-assistance.png';
import delivery from '../../assets/images/delivery.png';
import iconInsurance from '../../assets/images/icon-insurance.png';
import emergencyAssistanceActive from '../../assets/images/emergency-assistance-active.png';
import deliveryActive from '../../assets/images/delivery-active.png';
import iconInsuranceActive from '../../assets/images/icon-insurance-active.png';
import './MyAccountFooter.scss';

class MyAccountFooter extends Component {
  static updateFooterChanges() {
    document.getElementById('root').classList.add('footer-change');
  }
  componentDidMount() {
    MyAccountFooter.updateFooterChanges();
  }
  componentDidUpdate() {
    MyAccountFooter.updateFooterChanges();
  }
  render() {
    return (
      <div className={`${this.props.classNameAccountPage}`}>
        <div>
          <NavLink to="/roadside-assist" activeClassName="active">
            <img className="emergency-assistance" src={this.props.activeFooterLink === 'emergencyAssist' ? emergencyAssistanceActive : emergencyAssistance} alt="Roadside Assistance" />
            <span>Roadside Assistance</span>
          </NavLink>
        </div>
        <div>
          <Link to="/my-account" className={this.props.activeFooterLink === 'myAccount' ? 'active' : ''}>
            <img className="delivery" src={this.props.activeFooterLink === 'myAccount' ? deliveryActive : delivery} alt="My Account" />
            <span>My Account</span>
          </Link>
        </div>
        <div>
          <NavLink to="/car-documents" activeClassName="active">
            <img className="icon-insurance" src={this.props.activeFooterLink === 'carDocument' ? iconInsuranceActive : iconInsurance} alt="Car documents" />
            <span>Car Documents</span>
          </NavLink>
        </div>
      </div>
    );
  }
}
MyAccountFooter.propTypes = {
  activeFooterLink: PropTypes.string.isRequired,
  classNameAccountPage: PropTypes.string.isRequired
};

export default MyAccountFooter;
