import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import {
  showNotification,
  Link
} from 'react-admin';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import {Api} from '../../config/ApplicationContext';


class VehicleCreateButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDialog: false,
      vehicleData: {},
      vin: '',
      isVehicleImported: false,
      hasError: false,
      errorMessage: ''
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleCloseClick = this.handleCloseClick.bind(this);
    this.handleVINSubmit = this.handleVINSubmit.bind(this);
    this.handleVinChange = this.handleVinChange.bind(this);
    this.createVehicleRef = React.createRef();
  }
  handleClick() {
    this.setState({ showDialog: true });
  }
  handleCloseClick() {
    this.setState({ showDialog: false });
  }
  handleVinChange(e) {
    this.setState({
      vin: e.target.value,
    });
  }
  handleVINSubmit() {
    this.props.showNotification('Please wait. Data import is in progress');
    Api.get(`/admin/vehicle/vins/${this.state.vin}`).then((response) => {
      this.setState({
        vehicleData: response,
        isVehicleImported: true
      });
      this.props.showNotification('Data is Imported. Please Click on Create Vehicle button.');
    }).catch((error) => {
      if (error.status === 404) {
        this.setState({
          hasError: true,
          errorMessage: 'No Vehicle found for given VIN number.'
        });
      } else if (error.status === 400) {
        error.json().then((data) => {
          data.validationErrors.forEach((field) => {
            this.setState({
              hasError: true,
              errorMessage: field.message
            });
          });
        });
      }
    });
  }
  render() {
    const { showDialog } = this.state;
    const cancelButton =
      (
        <Button onClick={this.handleCloseClick}>
          Cancel
        </Button>
      );
    const createVehicleButton = this.state.isVehicleImported ? (
      <Button
        ref={this.createVehicleRef}
        component={Link}
        to={{
          pathname: '/vehicle/create',
          state: { record: this.state.vehicleData },
        }}
      >
        Create Vehicle
      </Button>
    ) : (
      null
    );

    return (
      <Fragment>
        <Button color="primary" onClick={this.handleClick}>
          Create Vehicle
        </Button>
        <Dialog
          fullWidth
          open={showDialog}
          onClose={this.handleCloseClick}
          aria-label="Create Vehicle"
        >
          <DialogTitle disableTypography>Enter VIN number to Import Vehicle data from Fleetio</DialogTitle>
          <DialogContent>
            <p className={ this.state.hasError ? 'error-message' : 'hide-error'}>{ this.state.errorMessage }</p>
            <input placeholder="VIN number" value={this.state.vin} onChange={this.handleVinChange} required />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleVINSubmit} disabled={!this.state.vin}>
              Import Vehicle Data
            </Button>
            {createVehicleButton}
            {cancelButton}
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}
const enhance = connect(null, { showNotification });

VehicleCreateButton.propTypes = {
  showNotification: PropTypes.func.isRequired
};

export default enhance(VehicleCreateButton);

