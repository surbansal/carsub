import React, {Component, Fragment} from 'react';
import { List, Datagrid, TextField, ShowButton } from 'react-admin';

class AreaList extends Component {
  render() {
    return (
      <List {... this.props} perPage={100} bulkActionButtons={<Fragment />}>
        <Datagrid>
          <TextField label="Area" source="areaName" />
          <TextField label="Region" source="regionName" />
          <ShowButton />
        </Datagrid>
      </List>
    );
  }
}

export default AreaList;
