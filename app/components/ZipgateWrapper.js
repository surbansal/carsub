import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import ZipCodeService from '../services/api/ZipCodeService';
import ZipCodeModal from './modal/ZipCodeModal';
import {segmentAnalytics} from '../config/ApplicationContext';


class ZipgateWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      showError: false
    };
    this.addZipCodeData = this.addZipCodeData.bind(this);
  }

  componentWillMount() {
    if ((!ZipCodeService.getZipCookie() || (ZipCodeService.getZipCookie() && ZipCodeService.isAAARedirect())) &&
      !(window.location.href.endsWith('/login')
      || window.location.href.includes('/verify-email')
      || window.location.href.includes('/reset-password'))) {
      this.setState({
        showModal: true
      });
    } else if (ZipCodeService.getZipCookie()) {
      ZipCodeService.checkAndNavigateOutOfRegionUsers();
    }
  }

  addZipCodeData(zip) {
    segmentAnalytics.track('Captured Zip Code', {
      category: 'Enter Zip',
      label: zip,
      nonInteraction: true
    });
    this.setState({
      showError: false
    });
    ZipCodeService.setZipCode(zip).then((zipCookie) => {
      if (zipCookie === 'flag') {
        this.setState({
          showModal: true
        });
      } else if (zipCookie) {
        this.setState({
          showModal: false
        });
      } else {
        this.setState({
          showError: true
        });
      }
    });
  }

  render() {
    return (
      <Fragment>
        <ZipCodeModal
          id="zip_code_modal"
          addZipCodeData={(zip) => { this.addZipCodeData(zip); }}
          showModal={this.state.showModal}
          showError={this.state.showError}
        />
        {this.props.children}
      </Fragment>
    );
  }
}

ZipgateWrapper.propTypes = {
  children: PropTypes.element.isRequired
};

export default ZipgateWrapper;
