import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {
  ArrayField,
  ArrayInput,
  CardActions,
  Datagrid,
  FileField,
  FileInput,
  FormTab,
  NumberField,
  NumberInput,
  ReferenceField,
  RefreshButton,
  refreshView,
  required,
  SaveButton,
  SelectInput,
  Show,
  showNotification,
  SimpleFormIterator,
  TabbedForm,
  TextField,
  Toolbar
} from 'react-admin';
import Button from '@material-ui/core/Button';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import NumberFormat from 'react-number-format';
import {connect} from 'react-redux';
import _ from 'lodash';
import defaultMoment from 'moment';
import DateInput from './fields/DateInput';
import AddressField from './fields/AddressField';
import DateField from './fields/DateField';
import {Api, segmentAnalytics} from '../../config/ApplicationContext';
import MediaFileField from './fields/MediaFileField';
import AdminModalService from '../../services/AdminModalService';
import ConfirmationModal from './ConfirmationModal';
import MilesDrivenField from './fields/MilesDrivenField';
import MileageTable from './table/MileageTable';
import MilesPercentageField from './fields/MilesPercentageField';
import SubExpiredField from './fields/SubExpiredField';

class SubscriptionView extends Component {
  static confirmMileagePackageAddition(mileagePackage, totalTax) {
    return new Promise((resolve, reject) => {
      AdminModalService.showModalContent((
        <div className="admin-modal">
          <div className="header">
            Are you sure you want to add a mileage package?
          </div>
          <div className="body">
            The subscribed user will be charged immediately on their default payment card for the following transaction: <br />
            <ul>
              <li>
                <b>Miles Added</b>
                <span className="value">
                  <NumberFormat displayType="text" decimalScale={0} decimalSeparator="" value={mileagePackage.miles} />
                </span>
              </li>
              <li>
                <b>Price Per Miles</b>
                <span className="value">
                  <NumberFormat displayType="text" decimalScale={2} decimalSeparator="." value={mileagePackage.costPerMile} prefix="$" />
                </span>
              </li>
              <li>
                <b>Tax </b>
                <span className="value">
                  <NumberFormat displayType="text" decimalScale={2} decimalSeparator="." value={totalTax} prefix="$" />
                </span>
              </li>
              <li>
                <b>Total Price</b>
                <span className="value">
                  <NumberFormat displayType="text" decimalScale={2} decimalSeparator="." value={((mileagePackage.costPerMile * mileagePackage.miles) + totalTax)} prefix="$" />
                </span>
              </li>
              <div className="confirmation-dialog">
                <button className="csa-button accent" onClick={resolve}>Yes, Charge the Customer</button>
                <button className="csa-button" onClick={reject}>Cancel</button>
              </div>
            </ul>
          </div>
        </div>
      ));
    });
  }
  static createVehicleChoice(vehicle) {
    return {
      id: vehicle.publicId,
      name: vehicle.vin
    };
  }

  static contractGenerationModal() {
    return new Promise((resolve, reject) => {
      AdminModalService.showModalContent((
        <div className="admin-modal information-dialog-size">
          <div className="header">
           Please generate contract
          </div>
          <div className="body">
           No contract present for this subscription. Please generate contract before approving subscription.<br />
            <div className="information-dialog-buttons">
              <button className="ok-btn" onClick={reject}>Ok</button>
            </div>
          </div>
        </div>
      ));
    });
  }

  static changes(object, base) {
    return _.transform(object, (result, value, key) => {
      if (!_.isEqual(value, base[key])) {
        // eslint-disable-next-line no-param-reassign
        result[key] = (_.isObject(value) && _.isObject(base[key])) ? SubscriptionView.changes(value, base[key]) : value;
      }
    });
  }

  static difference(object, base) {
    return SubscriptionView.changes(object, base);
  }

  static async downloadContract(subscription) {
    try {
      AdminModalService.showModalContent(null);
      await Api.get(`/admin/subscription/${subscription.id}/contract`).then((response) => {
        window.open(response.location);
      });
    } finally {
      AdminModalService.showModalContent(null);
    }
  }

  constructor(props) {
    super(props);
    this.approveSubscription = this.approveSubscription.bind(this);
    this.denySubscription = this.denySubscription.bind(this);
    this.markRenewalStatus = this.markRenewalStatus.bind(this);
    this.regenerateContract = this.regenerateContract.bind(this);
    this.saveSubscription = this.saveSubscription.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubscriptionDurationChange = this.handleSubscriptionDurationChange.bind(this);
    this.isRenewTabSelected = this.isRenewTabSelected.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.state = {
      availableVehicles: [],
      mileagePackages: [],
      subscriptionLengths: [],
      timeFrames: [],
      subscriptionId: this.props.id,
      isRenewedSubscriptionPresent: false,
      showCustomLengthInput: false,
      displaySubscriptionRenewalTab: false,
      customSubscriptionLengthValue: '',
      active: true,
      initialSubValues: {}
    };
  }

  componentDidMount() {
    Api.get(`/admin/vehicle/renewal/${this.state.subscriptionId}`).then((response) => {
      const choices = [];
      response.forEach((vehicle) => {
        const vehicleChoice = SubscriptionView.createVehicleChoice(vehicle);
        choices.push(vehicleChoice);
      });
      this.setState({
        availableVehicles: choices
      });
    });
    Api.get('/subscription/options').then((response) => {
      const mileagePackageChoices = response.mileagePackages;
      const subscriptionLengthChoices = response.termLengths;
      const timeFrameChoices = response.timeFrames;
      this.setState({
        mileagePackages: mileagePackageChoices,
        subscriptionLengths: subscriptionLengthChoices,
        timeFrames: timeFrameChoices
      });
    });
    this.refreshData();
  }

  refreshData() {
    Api.get(`/admin/subscription/${this.state.subscriptionId}`).then((response) => {
      if (response.eligibleForRenewal) {
        this.setState({
          displaySubscriptionRenewalTab: true
        });
      }
      if (response.renewedSubscription !== null) {
        this.setState({
          isRenewedSubscriptionPresent: true
        });
      }
      if (response.eligibleForRenewal && !response.renewedSubscription !== null && response.renewalRequest.subscriptionOptions.subscriptionLengthUnit === 'CUSTOM') {
        this.setState({
          showCustomLengthInput: true
        });
      }
      this.setState({
        active: response.active,
        initialSubValues: response
      });
    });
    this.props.refreshView();
  }


  isRenewTabSelected() {
    const renewSubscriptionUrl = this.props.location.pathname;
    const isRenewTab = renewSubscriptionUrl.split('/').indexOf('renew') > -1;
    return isRenewTab;
  }

  async approveSubscription(subscription) {
    const request = {
      subscriptionId: subscription.id,
      type: 'APPROVED'
    };
    try {
      if (subscription.contract === null) {
        await SubscriptionView.contractGenerationModal();
        AdminModalService.showModalContent(null);
      }
      await ConfirmationModal.show('Do you want to approve subscription?', 'The user will be sent a contract to sign and the subscription will be approved.');
      AdminModalService.showModalContent(null);
      await Api.post('/admin/subscription/approval', request).then(() => {
        segmentAnalytics.track('Executed Subscription Agreement and Taken Delivery of Car', {
          category: 'Subscriber'
        });
      });
    } finally {
      AdminModalService.showModalContent(null);
      this.refreshData();
    }
  }

  async denySubscription(subscription) {
    const request = {
      subscriptionId: subscription.id,
      type: 'DENIED'
    };
    try {
      await ConfirmationModal.show('Do you want to deny subscription?', 'After this subscription will get denied.');
      AdminModalService.showModalContent(null);
      await Api.post('/admin/subscription/approval', request);
    } finally {
      AdminModalService.showModalContent(null);
      this.refreshData();
    }
  }

  async markRenewalStatus(subscription, status) {
    const request = {
      subscriptionId: subscription.id,
      renewalStatus: status
    };
    const messaging = {
      ELIGIBLE: 'Are you sure you want to mark this subscription as eligible for renewal? This will allow the renewal process from the subscription management admin screen',
      INELIGIBLE: 'Are you sure you want to mark this subscription as ineligible for renewal? You will not be able to renew this subscription'
    };
    try {
      await ConfirmationModal.show('Are you sure?', messaging[status]);
      AdminModalService.showModalContent(null);
      await Api.post('/admin/subscription/status/renewal', request);
    } finally {
      this.refreshData();
      AdminModalService.showModalContent(null);
    }
  }

  async regenerateContract(subscription) {
    try {
      await ConfirmationModal.show('Do you want to regenerate contract?', 'After this contract will get regenerated.');
      AdminModalService.showModalContent(null);
      await Api.post(`/admin/subscription/${subscription.id}/contract`, {}).then(() => {
        this.props.showNotification('Contract regenerated');
      });
    } finally {
      AdminModalService.showModalContent(null);
      this.refreshData();
    }
  }

  async saveSubscription(subscription) {
    try {
      const latestSubscriptionData = await Api.get(`/admin/subscription/${this.state.subscriptionId}`);
      if (subscription.deliveryOptions.deliveryDate instanceof defaultMoment) {
        // eslint-disable-next-line no-param-reassign
        subscription.deliveryOptions.deliveryDate = subscription.deliveryOptions.deliveryDate.format('YYYY-MM-DD');
      }
      const diff = SubscriptionView.difference(subscription, this.state.initialSubValues);
      // These are immutable fields
      delete diff.scheduledSubscriptionPayments;
      delete diff.subscriptionStatus;
      delete diff.contract;
      if (diff.subscriptionUsage) {
        delete diff.subscriptionUsage.subscriptionStartDate;
        delete diff.subscriptionUsage.subscriptionEndDate;
      }
      // Have to use new object so react admin will remove the filename after saving
      const mergedSubscription = _.merge(latestSubscriptionData, diff);

      if (this.isRenewTabSelected()) {
        const mileagePackage = this.state.mileagePackages.find(m => m.id === mergedSubscription.renewalRequest.subscriptionOptions.mileagePackage.id);
        const subscriptionLength = this.state.subscriptionLengths.find(l => l.id === mergedSubscription.renewalRequest.subscriptionOptions.subscriptionLength.id);
        const subscriptionOptions = {
          mileagePackage,
          mileageValue: mileagePackage.value,
          mileageUnit: mileagePackage.unit,
          subscriptionLength,
          subscriptionLengthValue: subscriptionLength.unit === 'CUSTOM' ? this.state.customSubscriptionLengthValue : subscriptionLength.value,
          subscriptionLengthUnit: subscriptionLength.unit
        };
        subscriptionOptions.subscriptionLength.value = subscriptionOptions.subscriptionLengthValue;
        const deliveryTimeFrame = this.state.timeFrames.find(t => t.id === mergedSubscription.renewalRequest.deliveryOptions.deliveryTimeFrame.id);
        const {deliveryOptions} = mergedSubscription.renewalRequest;
        if (deliveryOptions.deliveryInstructions) { delete deliveryOptions.deliveryInstructions.id; }
        deliveryOptions.deliveryTimeFrame = deliveryTimeFrame;
        deliveryOptions.deliveryTimeFrameDisplayName = deliveryTimeFrame.displayName;
        if (deliveryOptions.deliveryDate instanceof defaultMoment) {
          deliveryOptions.deliveryDate = deliveryOptions.deliveryDate.format('YYYY-MM-DD');
        }
        const request = {
          subscriptionOptions,
          deliveryOptions,
          subscriptionId: mergedSubscription.renewalRequest.subscriptionId,
          vehiclePublicId: mergedSubscription.renewalRequest.vehiclePublicId,
        };

        await Api.post('/admin/subscription/renew', request);
        this.props.showNotification('Record updated');
        const showSubscriptionTab = this.props.location.pathname.replace('/show/renew', '/show');
        this.props.history.push({pathname: showSubscriptionTab});
      } else {
        if (mergedSubscription.mileageAddition && mergedSubscription.mileageAddition.miles && mergedSubscription.mileageAddition.costPerMile !== null) {
          const taxForAddress = await Api.get(`/tax/zip/${mergedSubscription.personalInformation.homeAddress.zipCode}`);
          const totalTax = mergedSubscription.mileageAddition.miles * mergedSubscription.mileageAddition.costPerMile * taxForAddress.estimatedCombinedRate;
          await SubscriptionView.confirmMileagePackageAddition(mergedSubscription.mileageAddition, totalTax);
          AdminModalService.showModalContent(null);
          await Api.post(`/admin/subscription/${mergedSubscription.id}/mileage-additions`, mergedSubscription.mileageAddition);
          mergedSubscription.mileageAddition.miles = null;
        }
        if (mergedSubscription.inspectionSheetUpload) {
          const uploadedInspectionSheet = await Api.upload('/admin/media', mergedSubscription.inspectionSheetUpload.rawFile);
          mergedSubscription.inspectionSheet = uploadedInspectionSheet;
        }
        await Api.post('/admin/subscription', mergedSubscription);
        this.props.showNotification('Record updated');
      }
    } catch (errorData) {
      errorData.json().then((data) => {
        if (errorData.status === 400 && data.validationErrors) {
          this.props.showNotification(data.validationErrors[0].message);
        } else {
          this.props.showNotification(data.message);
        }
      });
    } finally {
      this.refreshData();
      // eslint-disable-next-line no-param-reassign
      subscription.inspectionSheetUpload = null;
      AdminModalService.showModalContent(null);
    }
  }

  handleToggle () {
    this.setState(state => ({ open: !state.open }));
  }

  handleClose(event) {
    if (this.anchorEl.contains(event.target)) {
      return;
    }

    this.setState({ open: false });
  }

  handleSubscriptionDurationChange(event, key) {
    const durationId = key;
    const termLength = this.state.subscriptionLengths.find((term) => {
      return term.id === durationId;
    });
    if (termLength.unit === 'CUSTOM') {
      this.setState({
        showCustomLengthInput: true,
      });
    } else {
      this.setState({
        customSubscriptionLengthValue: '',
        showCustomLengthInput: false,
      });
    }
  }

  handleOtherSubscriptionLengthChange(e) {
    this.setState({
      customSubscriptionLengthValue: parseInt(e.target.value, 10)
    });
  }

  render() {
    const ShowActions = ({data}) => {
      return (
        <div>
          <Grid container spacing={24}>
            <Grid xs={6} style={{color: 'grey', fontStyle: 'italic'}}>
              {data && !data.active &&
                <b>Subscription Expired or Denied</b>
              }
            </Grid>
            <Grid xs={6}>
              <CardActions>
                <div>
                  <Button
                    buttonRef={(node) => {
                      this.anchorEl = node;
                    }}
                    aria-owns={this.state.open ? 'menu-list-grow' : null}
                    aria-haspopup="true"
                    color="primary"
                    onClick={this.handleToggle}
                  >
                    Menu
                  </Button>
                  <Popper open={this.state.open} anchorEl={this.anchorEl} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        id="menu-list-grow"
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                      >
                        <Paper>
                          <ClickAwayListener onClickAway={this.handleClose}>
                            <MenuList>
                              {data && data.subscriptionStatus === 'PENDING' && data.active && (
                                <Fragment>
                                  <MenuItem onClick={() => this.approveSubscription(data)}>Approve</MenuItem>
                                  <MenuItem onClick={() => this.denySubscription(data)}>Deny</MenuItem>
                                </Fragment>
                              )};
                              <MenuItem onClick={() => SubscriptionView.downloadContract(data)}>View Contract</MenuItem>
                              {data && data.active && (
                                <MenuItem onClick={() => this.regenerateContract(data)}>Regenerate Contract</MenuItem>
                              )};
                              {data && data.subscriptionStatus === 'CONFIRMED' && !data.renewalStatus && data.active && (
                                <Fragment>
                                  <MenuItem onClick={() => this.markRenewalStatus(data, 'ELIGIBLE')}>Mark Eligible For Renewal</MenuItem>
                                  <MenuItem onClick={() => this.markRenewalStatus(data, 'INELIGIBLE')}>Mark Ineligible For Renewal</MenuItem>
                                </Fragment>
                              )};
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </div>
                <RefreshButton />
              </CardActions>
            </Grid>
          </Grid>
        </div>
      );
    };

    const SubscriptionToolbar = props => (
      <Toolbar {...props} >
        {(this.state.active || this.isRenewTabSelected()) &&
          <SaveButton
            label="Save"
            redirect="edit"
            submitOnEnter={false}
          />
        }
      </Toolbar>
    );
    const customSubscriptionLength = this.state.showCustomLengthInput ?
      (
        <input
          ref={(el) => {
            if (el) {
              el.style.setProperty('border', '1px solid black', 'important');
            }
          }}
          type="number"
          min="1"
          max="12"
          step="1"
          value={this.state.customSubscriptionLengthValue}
          placeholder="Custom Length"
          onChange={(e) => { this.handleOtherSubscriptionLengthChange(e, false); }}
        />
      ) : null;
    const disableDeliveryDate = this.state.initialSubValues.isCarDelivered;
    return (
      <Show {...this.props} actions={<ShowActions />}>
        <TabbedForm
          toolbar={<SubscriptionToolbar />}
          save={this.saveSubscription}
          defaultValue={{mileageAddition: {costPerMile: 0.1}}}
        >
          <FormTab label="personal information">
            <SubExpiredField label="First Name" source="personalInformation.firstName" />
            <SubExpiredField label="Middle name" source="personalInformation.middleName" />
            <SubExpiredField label="Last Name" source="personalInformation.lastName" />
            <SubExpiredField label="Email" source="personalInformation.email" />
            <AddressField label="Home Address" source="personalInformation.homeAddress" />
            <TextField label="Phone" source="personalInformation.phone.phoneNumber" />
            <SubExpiredField label="Drivers License" source="personalInformation.driverLicenseNumber" />
          </FormTab>
          <FormTab label="subscription options">
            <TextField label="Mileage Package" source="subscriptionOptions.mileagePackage.displayName" />
            <TextField label="Subscription Length (months)" source="subscriptionOptions.subscriptionLengthValue" />
          </FormTab>
          <FormTab label="delivery options">
            <SubExpiredField label="Delivery Date" source="deliveryOptions.deliveryDate" type="date" options={{ format: 'MM/DD/YYYY', disabled: disableDeliveryDate }} />
            <TextField label="Delivery Time" source="deliveryOptions.deliveryTimeFrame.displayName" />
            <AddressField label="Delivery Address" source="deliveryOptions.deliveryAddress" />
            <SubExpiredField label="Instructions" source="deliveryOptions.deliveryInstructions.instructions" />
          </FormTab>
          <FormTab label="status">
            <TextField label="Status" source="subscriptionStatus" />
            <SubExpiredField label="Email Verified" source="isEmailConfirmed" type="bool" />
            <SubExpiredField label="Contract Signed" source="isContractSigned" type="bool" />
            <SubExpiredField label="Car Delivered" source="isCarDelivered" type="bool" />
            <SubExpiredField label="Subscription Active" source="isSubscriptionActive" type="bool" />
            <TextField label="Renewal Eligibility" source="renewalStatus" />
            {this.state.isRenewedSubscriptionPresent &&
              <ReferenceField label="Renewed Subscription" source="renewedSubscription.id" reference="subscription">
                <TextField source="id" />
              </ReferenceField>
            }
          </FormTab>
          <FormTab label="payments" >
            <ArrayInput fullWidth label="Scheduled subscription payments by date" source="scheduledSubscriptionPaymentsByDate">
              <SimpleFormIterator disableAdd disableRemove>
                <DateInput source="paymentDate" options={{ format: 'MM/DD/YYYY', disabled: true }} />
                <SubExpiredField label="Payment Amount" source="paymentAmount" type="disabledInput" />
                <SubExpiredField label="Successfully Paid" source="isSuccessfullyPaid" type="disabledInput" />
              </SimpleFormIterator>
            </ArrayInput>
          </FormTab>
          <FormTab label="Subscription Usage">
            <SubExpiredField label="Starting Mileage" source="subscriptionUsage.vehicleStartingMileage" />
            <TextField label="Current Mileage" source="subscriptionUsage.currentVehicleMileage" />
            <TextField label="Start Date" source="subscriptionUsage.subscriptionStartDate" />
            <TextField label="End Date" source="subscriptionUsage.subscriptionEndDate" />
            <MilesDrivenField label="Miles Driven" source="subscriptionUsage" />
            <MilesPercentageField label="Percentage of Miles Driven" source="subscriptionUsage" />
            <ReferenceField label="Vehicle" source="vehicle.id" reference="vehicle" linkType="edit">
              <TextField source="vin" />
            </ReferenceField>
            <MileageTable label="Monthly Mileage Statistics" />
            <ArrayField source="mileageAdditions">
              <Datagrid>
                <DateField source="createdOn" label="Date Added" />
                <NumberField source="miles" label="Total Miles Added" />
                <NumberField source="costPerMile" label="Price Per Mile" options={{ style: 'currency', currency: 'USD' }} />
                <NumberField source="paymentAmount" label="Total Amount Paid" options={{ style: 'currency', currency: 'USD' }} />
              </Datagrid>
            </ArrayField>
            {this.state.active &&
              <div>
                <NumberInput source="mileageAddition.miles" step={1} label="New Mileage Addition Miles" style={{width: '256px'}} />
                <NumberInput source="mileageAddition.costPerMile" step={0.01} defaultValue={0.10} label="New Mileage Addition Price Per Mile" style={{width: '256px'}} />
              </div>
            }
          </FormTab>
          <FormTab label="Files">
            <MediaFileField source="inspectionSheet.storageId" label="Inspection Sheet" />
            {this.state.active &&
              <div style={{width: '100%'}}>
                <FileInput source="inspectionSheetUpload" label="Upload New Inspection Sheet" accept="application/pdf">
                  <FileField title="title" />
                </FileInput>
              </div>
            }
          </FormTab>
          {!this.state.isRenewedSubscriptionPresent && this.state.displaySubscriptionRenewalTab &&
            <FormTab label="Subscription Renew" path="renew">
              <SelectInput
                source="renewalRequest.vehiclePublicId"
                label="Available vehicles"
                choices={this.state.availableVehicles}
                validate={required()}
              />
              <SelectInput
                source="renewalRequest.subscriptionOptions.mileagePackage.id"
                label="Mileage Package"
                choices={this.state.mileagePackages}
                optionText="displayName"
                validate={required()}
              />
              <SelectInput
                source="renewalRequest.subscriptionOptions.subscriptionLength.id"
                label="Subscription Length"
                choices={this.state.subscriptionLengths}
                validate={required()}
                optionText="displayName"
                onChange={(event, key) => { this.handleSubscriptionDurationChange(event, key); }}
              />
              {customSubscriptionLength}
              <SelectInput
                source="renewalRequest.deliveryOptions.deliveryTimeFrame.id"
                label="Select Timeframe"
                choices={this.state.timeFrames}
                optionText="displayName"
                validate={required()}
              />
              <DateInput
                label="Delivery Date"
                source="renewalRequest.deliveryOptions.deliveryDate"
                options={{ format: 'MM/DD/YYYY', disablePast: 'true' }}
                validate={required()}
              />
            </FormTab>
          }
        </TabbedForm>
      </Show>
    );
  }
}

const enhance = connect(null, {refreshView, showNotification});

SubscriptionView.propTypes = {
  refreshView: PropTypes.func.isRequired,
  showNotification: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default enhance(SubscriptionView);
