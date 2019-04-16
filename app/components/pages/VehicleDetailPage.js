import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';
import VehicleDetailComponent from '../vehicle-detail/VehicleDetailComponent';
import {Api, segmentAnalytics} from '../../config/ApplicationContext';
import OfflineIndicator from '../OfflineIndicator';

class VehicleDetailPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicle: null,
      isOffline: false,
      footerChangeClass: true
    };
    this.updateFooterChange = this.updateFooterChange.bind(this);
  }
  componentDidMount() {
    Api.get(`/vehicles/${this.props.match.params.id}`).then((response) => {
      this.setState({
        vehicle: response
      });
    }).catch((error) => {
      if (error.status === undefined) {
        this.setState({
          isOffline: true
        });
      }
    });
  }
  updateFooterChange(data) {
    this.setState({footerChangeClass: data});
  }
  render() {
    if (this.state.isOffline) {
      return (
        <HeaderAndFooterPage>
          <OfflineIndicator />
        </HeaderAndFooterPage>
      );
    }
    segmentAnalytics.track('View Vehicle Details', {
      category: 'Check Cars'
    });
    const footerName = this.state.footerChangeClass === true ? 'change-footer' : '';
    return (
      <HeaderAndFooterPage classNameFooterAlignment={footerName}>
        {this.state.vehicle ? <VehicleDetailComponent vehicle={this.state.vehicle} updateFooterChange={this.updateFooterChange} /> : <Fragment />}
      </HeaderAndFooterPage>
    );
  }
}

VehicleDetailPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired
};

export default VehicleDetailPage;
