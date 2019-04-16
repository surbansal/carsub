import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  ArrayInput,
  BooleanInput,
  Create,
  FileField,
  FileInput,
  FormTab,
  refreshView,
  required,
  SaveButton,
  SelectInput,
  showNotification,
  SimpleFormIterator,
  TabbedForm,
  TextField,
  TextInput,
  Toolbar
} from 'react-admin';
import {connect} from 'react-redux';
import {getFormValues, isSubmitting, isValid, submit} from 'redux-form';
import {push} from 'react-router-redux';
import {Api} from '../../config/ApplicationContext';
import ConfirmationModal from './ConfirmationModal';
import AdminModalService from '../../services/AdminModalService';
import PublicImageField from './fields/PublicImageField';
import MarkdownField from './fields/MarkdownField';
import VehiclePriceField from './fields/VehiclePriceField';


class VehicleCreate extends Component {
  constructor(props) {
    super(props);
    this.vehiclePriceRef = React.createRef();
    this.saveVehicle = this.saveVehicle.bind(this);
    this.handleSaveClick = this.handleSaveClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSaveClick () {
    this.props.submit('vehicle-create-form');
  }
  handleSubmit(event) {
    const vehicle = this.props.recordLiveValues;
    if (event && event.preventDefault) {
      event.preventDefault();
    }
    if (!this.props.valid) {
      this.props.showNotification('Please fill in all required fields before continuing.');
    } else if (!vehicle.vehicleImageUpload) {
      this.props.showNotification('Please upload vehicle image before continuing.');
    } else {
      this.saveVehicle(vehicle);
    }
  }
  async saveVehicle(vehicle) {
    try {
      await ConfirmationModal.show('Confirmation', 'Are you sure you want to create vehicle.');
      AdminModalService.showModalContent(null);
      if (vehicle.vehicleImageUpload) {
        const uploadedVehicleImage = await Api.upload('/admin/public-media', vehicle.vehicleImageUpload.rawFile);
        // eslint-disable-next-line no-param-reassign
        vehicle.imageStorageId = uploadedVehicleImage.storageId;
        // eslint-disable-next-line no-param-reassign
        vehicle.vehicleImageUpload = null;
      }
      const vehicleResponse = await Api.post('/admin/vehicle', vehicle);
      await this.vehiclePriceRef.current.handlePricesChange(vehicleResponse.publicId);
      this.props.showNotification('Record Created');
      this.props.push('/vehicle');
    } catch (e) {
      this.props.showNotification('Unexpected Error: Something went wrong when creating vehicle');
      throw e;
    } finally {
      AdminModalService.showModalContent(null);
    }
  }

  render() {
    const CustomSaveToolbar = props => (
      <Toolbar {...props}>
        <SaveButton
          label="Create New Vehicle"
          saving={this.props.isSubmitting}
          onClick={this.handleSaveClick}
        />
      </Toolbar>
    );
    return (
      <Create {...this.props} >
        <TabbedForm toolbar={<CustomSaveToolbar />} onSubmit={this.handleSubmit} resource="vehicle" form="vehicle-create-form">
          <FormTab label="Vehicle">
            <SelectInput
              source="vehicleStatus"
              label="Status"
              choices={[
                { id: 'AVAILABLE', name: 'Available' },
                { id: 'REFLEETING', name: 'Refleeting' },
                { id: 'BOOKED', name: 'Booked' },
                { id: 'SUBSCRIBED', name: 'Subscribed' },
              ]}
              validate={required()}
            />
            <TextInput label="VIN" source="vin" validate={required()} />
            <TextField label="License Plate" source="licensePlate" />
            <TextField label="Current Mileage" source="currentStatus.mileage" />
            <TextInput label="Spincar Vehicle ID" source="spincarId" validate={required()} />
            <BooleanInput label="Show When Unavailable" source="showWhenUnavailable" />
            <PublicImageField source="imageStorageId" label="Vehicle Image" validate={required()} />
            <FileInput source="vehicleImageUpload" label="Upload New Vehicle Image (600 X 334 Recommended. Max Size 1 MB)" accept="image/*" >
              <FileField title="title" />
            </FileInput>
          </FormTab>
          <FormTab label="Model">
            <TextInput label="Manufacturer" source="configuration.model.manufacturer.name" validate={required()} />
            <TextInput label="Model Name" source="configuration.model.name" validate={required()} />
            <TextInput label="Year" source="configuration.model.year" validate={required()} />
            <TextInput label="Estimated Mileage" source="configuration.model.estimatedMileage" validate={required()} />
            <TextInput label="Seating Capacity" source="configuration.model.seatingCapacity" validate={required()} />
            <TextInput label="Horsepower" source="configuration.model.horsePower" validate={required()} />
            <TextInput label="Engine Display Name" source="configuration.model.engineType.name" validate={required()} />
            <SelectInput
              source="configuration.model.engineType.type"
              label="Engine Type"
              choices={[
                { id: 'V4', name: 'V4' },
                { id: 'V6', name: 'V6' },
                { id: 'V8', name: 'V8' },
                { id: 'ELECTRIC', name: 'Electric' },
              ]}
              validate={required()}
            />
          </FormTab>
          <FormTab label="Features">
            <ArrayInput source="features">
              <SimpleFormIterator>
                <TextInput label="Title" source="title" validate={required()} />
                <MarkdownField label="Description" source="description" validate={required()} />
              </SimpleFormIterator>
            </ArrayInput>
          </FormTab>
          <FormTab label="Vehicle Configuration">
            <TextInput label="Transmission Name" source="configuration.transmissionType.name" validate={required()} />
            <SelectInput
              source="configuration.transmissionType.type"
              label="Transmission Type"
              choices={[
                { id: 'AUTOMATIC', name: 'Automatic' },
                { id: 'MANUAL', name: 'Manual' },
              ]}
              validate={required()}
            />
            <TextInput label="Exterior Name" source="configuration.exterior.name" validate={required()} />
            <SelectInput
              source="configuration.exterior.type"
              label="Exterior Type"
              choices={[
                { id: 'BLACK', name: 'Black' },
                { id: 'WHITE', name: 'White' },
                { id: 'GREY', name: 'Grey' },
                { id: 'BLUE', name: 'Blue' },
                { id: 'RED', name: 'Red' },
                { id: 'GREEN', name: 'Green' },
                { id: 'PURPLE', name: 'Purple' },
                { id: 'Silver', name: 'Silver' },
              ]}
              validate={required()}
            />
            <TextInput label="Interior Name" source="configuration.interior.name" validate={required()} />
            <SelectInput
              source="configuration.interior.materialType"
              label="Interior Material Type"
              choices={[
                { id: 'LEATHER', name: 'Leather' },
                { id: 'CLOTH', name: 'Cloth' },
              ]}
              validate={required()}
            />
            <SelectInput
              source="configuration.interior.colorType"
              label="Interior Color Type"
              choices={[
                { id: 'DARK', name: 'Dark' },
                { id: 'LIGHT', name: 'Light' },
              ]}
              validate={required()}
            />
          </FormTab>
          <FormTab label="Vehicle Prices">
            <VehiclePriceField label="Vehicle Prices" source="prices" ref={this.vehiclePriceRef} />
          </FormTab>
        </TabbedForm>
      </Create>
    );
  }
}

const mapStateToProps = state => ({
  recordLiveValues: getFormValues('vehicle-create-form')(state),
  valid: isValid('vehicle-create-form')(state),
  isSubmitting: isSubmitting('vehicle-create-form')(state)
});

const enhance = connect(mapStateToProps, {
  submit, push, refreshView, showNotification
});

VehicleCreate.propTypes = {
  refreshView: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  submit: PropTypes.func.isRequired,
  recordLiveValues: PropTypes.shape({}),
  valid: PropTypes.bool,
  isSubmitting: PropTypes.bool
};

VehicleCreate.defaultProps = {
  recordLiveValues: {},
  valid: false,
  isSubmitting: false
};

export default enhance(VehicleCreate);
