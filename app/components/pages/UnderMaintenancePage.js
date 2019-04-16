import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';
import './MessagingPage.scss';
import maintenanceImage from '../../assets/images/emergency-assistance.png';

class UnderMaintenancePage extends Component {
  constructor(props) {
    super(props);
    if (this.props.underMaintenance.redirect) {
      this.props.history.push({pathname: this.props.underMaintenance.redirect});
    }
  }

  render() {
    return (
      <HeaderAndFooterPage>
        <div className="messaging-page under-maintenance">
          <div className="header-info">
            <h1>{this.props.underMaintenance.title}</h1>
          </div>
          <div className="secondary-header">
            <h3>{this.props.underMaintenance.description}</h3>
            <h3>Apologies for the inconvenience!</h3>
            <img src={maintenanceImage} alt="Under Maintenance" />
          </div>
        </div>
      </HeaderAndFooterPage>
    );
  }
}

UnderMaintenancePage.propTypes = {
  underMaintenance: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    redirect: PropTypes.string
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(UnderMaintenancePage);
