import React, {Component, Fragment} from 'react';
import { List, Datagrid, TextField, EmailField, ShowButton, ReferenceField } from 'react-admin';
import SubscriptionField from './fields/SubscriptionField';
import DateField from './fields/DateField';

class LeadsList extends Component {
  render() {
    return (
      <List {... this.props} bulkActionButtons={<Fragment />}>
        <Datagrid>
          <TextField label="Lead ID" source="id" sortable={false} />
          <EmailField label="Email" source="personalInformation.email" sortable={false} />
          <DateField label="Started" source="createdOn" sortable={false} />
          <DateField label="Last Updated" source="lastModified" sortable={false} />
          <SubscriptionField label="Subscription Option" source="subscriptionOptions" sortable={false} />
          <SubscriptionField label="Personal Information" source="personalInformation" sortable={false} />
          <SubscriptionField label="Delivery Option" source="deliveryOptions" sortable={false} />
          <ReferenceField label="Vehicle" source="vehicle.id" reference="vehicle" linkType="edit" sortable={false} >
            <TextField source="vin" />
          </ReferenceField>
          <ShowButton />
        </Datagrid>
      </List>
    );
  }
}

export default LeadsList;
