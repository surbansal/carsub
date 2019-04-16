import React, {Component} from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {RadioButtonGroupInput} from 'react-admin';
import {Api, DmaApi} from '../../../config/ApplicationContext';

class VehicleAreaAssignmentField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      areas: [],
      selectedAreaId: null
    };
    this.handleAreaUpdate = this.handleAreaUpdate.bind(this);
    this.handleAreaChange = this.handleAreaChange.bind(this);
  }

  componentDidMount() {
    const programId = 'prg_car-subscription';
    DmaApi.get(`/programs/${programId}/areas`).then((resp) => {
      this.setState({
        areas: resp.content
      });
    });
  }

  handleAreaChange(event, key) {
    this.setState({
      selectedAreaId: key,
    });
  }

  async handleAreaUpdate() {
    const publicId = get(this.props.record, 'publicId');
    const defaultAreaId = get(this.props.record, 'areaId');
    const request = {
      vehicleId: publicId,
      areaId: (this.state.selectedAreaId !== null ? this.state.selectedAreaId : defaultAreaId)
    };
    await Api.put('/admin/vehicle/area', request);
  }

  render() {
    if (!this.state.areas) {
      return null;
    }
    return (
      <RadioButtonGroupInput
        source="areaId"
        choices={this.state.areas}
        optionText="areaName"
        optionValue="id"
        onChange={(event, key) => { this.handleAreaChange(event, key); }}
      />
    );
  }
}

VehicleAreaAssignmentField.propTypes = {
  record: PropTypes.shape
};

VehicleAreaAssignmentField.defaultProps = {
  record: {}
};

export default VehicleAreaAssignmentField;
