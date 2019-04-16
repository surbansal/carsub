import React, {Component, Fragment} from 'react';
import { List, Datagrid, TextField, EmailField, ShowButton, BooleanField, ReferenceField, FunctionField } from 'react-admin';
import DateField from './fields/DateField';

class SubscriptionList extends Component {
  render() {
    const rowStyle = (record) => {
      let backgroundColor = '#ffffff';
      let fontStyle = 'normal';
      let opacity = '1';
      if (record.expired || record.subscriptionStatus === 'DENIED') {
        fontStyle = 'italic';
        opacity = '0.5';
      } else if (record.daysIntoSubscription < 0) {
        backgroundColor = '#f5f2f0';
      }

      return {
        backgroundColor,
        fontStyle,
        opacity
      };
    };
    return (
      <List {... this.props} perPage={50} bulkActionButtons={<Fragment />}>
        <Datagrid rowStyle={rowStyle}>
          <FunctionField label="Name" source="personalInformation.firstName" render={record => `${record.personalInformation.firstName} ${record.personalInformation.middleNamePresent ? `${record.personalInformation.middleName}` : ''} ${record.personalInformation.lastName}`} />
          <EmailField label="Email" source="personalInformation.email" />
          <DateField label="Start Date" source="subscriptionUsage.subscriptionStartDate" format="MM/DD/YYYY" />
          <DateField label="End Date" source="subscriptionUsage.subscriptionEndDate" format="MM/DD/YYYY" />
          <BooleanField label="Email Verified" source="isEmailConfirmed" />
          <BooleanField label="Contract Signed" source="isContractSigned" />
          <BooleanField label="Car Delivered" source="isCarDelivered" />
          <BooleanField label="Subscription Active" source="isSubscriptionActive" />
          <TextField label="Status" source="subscriptionStatus" />
          <ReferenceField label="Vehicle" source="vehicle.id" reference="vehicle" linkType="edit">
            <TextField source="vin" />
          </ReferenceField>
          <ShowButton />
        </Datagrid>
      </List>
    );
  }
}

export default SubscriptionList;
