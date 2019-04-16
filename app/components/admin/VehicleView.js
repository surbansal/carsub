import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  ArrayInput,
  BooleanInput,
  FileField,
  FileInput,
  FormTab,
  refreshView,
  required,
  SelectInput,
  Show,
  showNotification,
  SimpleFormIterator,
  TabbedForm,
  TextField,
  TextInput
} from 'react-admin';
import {connect} from 'react-redux';
import CardActions from '@material-ui/core/CardActions';
import Button from '@material-ui/core/Button';
import VehiclePriceField from './fields/VehiclePriceField';
import VehicleAreaAssignmentField from './fields/VehicleAreaAssignmentField';
import {Api} from '../../config/ApplicationContext';
import ConfirmationModal from './ConfirmationModal';
import AdminModalService from '../../services/AdminModalService';
import MarkdownField from './fields/MarkdownField';
import PublicImageField from './fields/PublicImageField';

class VehicleView extends Component {
  constructor(props) {
    super(props);
    this.vehiclePriceRef = React.createRef();
    this.vehicleAreaRef = React.createRef();
    this.saveVehicle = this.saveVehicle.bind(this);
    this.deleteVehicle = this.deleteVehicle.bind(this);
  }
  async saveVehicle(vehicle) {
    try {
      await ConfirmationModal.show('Confirmation', 'Are you sure you want to save vehicle updates?');
      AdminModalService.showModalContent(null);
      this.vehicleAreaRef.current.handleAreaUpdate();
      if (vehicle.vehicleImageUpload) {
        const uploadedVehicleImage = await Api.upload('/admin/public-media', vehicle.vehicleImageUpload.rawFile);
        // eslint-disable-next-line no-param-reassign
        vehicle.imageStorageId = uploadedVehicleImage.storageId;
        // eslint-disable-next-line no-param-reassign
        vehicle.vehicleImageUpload = null;
      }
      await Api.put('/admin/vehicle', vehicle);
      await this.vehiclePriceRef.current.handlePricesChange();
      this.props.showNotification('Record updated');
    } finally {
      AdminModalService.showModalContent(null);
    }
  }

  async deleteVehicle(id) {
    try {
      await ConfirmationModal.show('Confirmation', 'Are you sure you want to delete vehicle?');
      AdminModalService.showModalContent(null);
      const deleteReq = {
        vehicleId: id
      };
      await Api.delete('/admin/vehicle', deleteReq);
      this.props.showNotification('Record Deleted');
    } finally {
      this.props.refreshView();
      AdminModalService.showModalContent(null);
    }
  }
  render() {
    const cardActionStyle = {
      zIndex: 2,
      display: 'inline-block',
      float: 'right',
    };

    const VehicleShowActions = ({data}) => (
      <CardActions style={cardActionStyle}>
        <Button color="primary" onClick={() => this.deleteVehicle(data.id)}>Delete</Button>
      </CardActions>
    );
    const VehicleTitle = ({ record }) => {
      return <span>{record ? `${record.configuration.model.year} ${record.configuration.model.manufacturer.name} ${record.configuration.model.name}` : ''}</span>;
    };
    return (
      <Show {...this.props} actions={<VehicleShowActions />} title={<VehicleTitle />}>
        <TabbedForm save={this.saveVehicle}>
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
            <TextField label="Current Mileage" source="currentStatus.mileage" validate={required()} />
            <TextInput label="Spincar Vehicle ID" source="spincarId" validate={required()} />
            <BooleanInput label="Show When Unavailable" source="showWhenUnavailable" />
            <PublicImageField source="imageStorageId" label="Vehicle Image" validate={required()} />
            <FileInput source="vehicleImageUpload" label="Upload New Vehicle Image (600 X 334 Recommended. Max Size 1 MB)" accept="image/*">
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
          <FormTab label="Area Assignment">
            <VehicleAreaAssignmentField ref={this.vehicleAreaRef} />
          </FormTab>
        </TabbedForm>
      </Show>
    );
  }
}

const enhance = connect(null, { refreshView, showNotification });

VehicleView.propTypes = {
  refreshView: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired
};

export default enhance(VehicleView);
