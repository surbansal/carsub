import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {refreshView, Show, showNotification, Tab, TabbedShowLayout, TextField} from 'react-admin';
import {connect} from 'react-redux';
import AddressField from './fields/AddressField';
import DateField from './fields/DateField';

class LeadsView extends Component {
  render() {
    return (
      <Show {...this.props}>
        <TabbedShowLayout>
          <Tab label="personal information">
            <TextField label="First Name" source="personalInformation.firstName" />
            <TextField label="Last Name" source="personalInformation.lastName" />
            <TextField label="Email" source="personalInformation.email" />
            <AddressField label="Home Address" source="personalInformation.homeAddress" />
            <TextField label="Phone" source="personalInformation.phone.phoneNumber" />
            <TextField label="Drivers License" source="personalInformation.driverLicenseNumber" />
          </Tab>
          <Tab label="subscription options">
            <TextField label="Mileage Package" source="subscriptionOptions.mileagePackage.displayName" />
            <TextField label="Subscription Length (months)" source="subscriptionOptions.subscriptionLengthValue" />
          </Tab>
          <Tab label="delivery options">
            <DateField label="Delivery Date" source="deliveryOptions.deliveryDate" format="MM/DD/YYYY" />
            <TextField label="Delivery Time" source="deliveryOptions.deliveryTimeFrame.displayName" />
            <AddressField label="Delivery Address" source="deliveryOptions.deliveryAddress" />
          </Tab>
        </TabbedShowLayout>
      </Show>
    );
  }
}

const enhance = connect(null, {refreshView, showNotification});

LeadsView.propTypes = {
  refreshView: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
};

export default enhance(LeadsView);
