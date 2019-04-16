import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {refreshView, required, Show, showNotification, SelectInput, FormTab, TabbedForm} from 'react-admin';
import {connect} from 'react-redux';
import {Api} from '../../config/ApplicationContext';
import ConfirmationModal from './ConfirmationModal';
import AdminModalService from '../../services/AdminModalService';

class AreaView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cmsVariations: []
    };
    this.saveAreaVariation = this.saveAreaVariation.bind(this);
  }

  componentWillMount() {
    Api.get('/cms/variations').then((response) => {
      this.setState({
        cmsVariations: response
      });
    });
  }
  async saveAreaVariation(areaVariation) {
    try {
      await ConfirmationModal.show('Confirmation', 'Are you sure you want to change variation?');
      AdminModalService.showModalContent(null);
      const reqBody = {
        areaId: areaVariation.id,
        variationId: areaVariation.variationId
      };
      await Api.post('/admin/area', reqBody);
      this.props.showNotification('Record updated');
    } finally {
      AdminModalService.showModalContent(null);
      this.props.refreshView();
    }
  }
  render() {
    return (
      <Show {...this.props}>
        <TabbedForm save={this.saveAreaVariation}>
          <FormTab label="Map Area to CMS Variations">
            <SelectInput
              source="variationId"
              label="CMS Variation"
              choices={this.state.cmsVariations}
              validate={required()}
            />
          </FormTab>
        </TabbedForm>
      </Show>
    );
  }
}

const enhance = connect(null, {refreshView, showNotification});

AreaView.propTypes = {
  refreshView: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
};

export default enhance(AreaView);
