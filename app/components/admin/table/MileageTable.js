import React, { Component } from 'react';
import propTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import get from 'lodash/get';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Api } from '../../../config/ApplicationContext';
import '../commonAdmin.scss';

class MileageTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscriptionId: get(this.props.record, 'id'),
      rows: {}
    };
    this.getVehiclesMonthlyMileageStatistics(this.state.subscriptionId);
  }

  getVehiclesMonthlyMileageStatistics(subscriptionId) {
    Api.get(`/admin/subscription/${subscriptionId}/vehicle-monthly-mileage-statistics`).then((response) => {
      this.setState({
        rows: response
      });
    }).catch(() => {
      this.setState({
        rows: {}
      });
    });
  }

  render() {
    return (
      <div className="custom-field mileage-table">
        <label htmlFor="label">{this.props.label}<br /></label>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Month</TableCell>
              <TableCell align="right">Miles Driven</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(this.state.rows).map((row) => {
              return (
                <TableRow key={row[0]}>
                  <TableCell component="th" scope="row">Month {row[0]}</TableCell>
                  <TableCell align="right">{row[1]}</TableCell>
                </TableRow>);
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}

MileageTable.defaultProps = {
  label: null,
  record: {}
};

MileageTable.propTypes = {
  label: propTypes.string,
  record: propTypes.shape({}),
};

export default MileageTable;
