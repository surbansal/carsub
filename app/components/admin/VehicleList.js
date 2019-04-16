import React, {Component} from 'react';
import {
  BooleanField,
  CardActions,
  Datagrid,
  ExportButton,
  List,
  RefreshButton,
  ShowButton,
  TextField
} from 'react-admin';
import VehicleCreateButton from './VehicleCreateButton';

class VehicleList extends Component {
  render() {
    const PostActions = ({
      exporter,
      filterValues,
      resource,
      currentSort,
    }) => (
      <CardActions>
        <ExportButton
          resource={resource}
          sort={currentSort}
          filter={filterValues}
          exporter={exporter}
        />
        <RefreshButton />
        <VehicleCreateButton />
      </CardActions>
    );
    return (
      <List {... this.props} bulkActions={false} perPage={50} actions={<PostActions />}>
        <Datagrid>
          <TextField label="Model Name" source="configuration.model.name" />
          <TextField label="Year" source="configuration.model.year" />
          <TextField label="Manufacturer" source="configuration.model.manufacturer.name" />
          <TextField label="VIN" source="vin" />
          <TextField label="Status" source="vehicleStatus" />
          <BooleanField label="Show When Unavailable" source="showWhenUnavailable" />
          <ShowButton />
        </Datagrid>
      </List>
    );
  }
}

export default VehicleList;
