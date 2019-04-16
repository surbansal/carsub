import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import Moment from 'react-moment';
import './VehicleDetailComponent.scss';
import BreadcrumbComponent from '../BreadcrumbComponent';
import VehicleHighlightItemComponent from './VehicleHighlightItemComponent';
import VehicleType from '../../types/VehicleType';
import VehicleSubscriptionWrapperComponent from './VehicleSubscriptionWrapperComponentDesktop';
import VehicleSubscriptionWrapperComponentMobile from './VehicleSubscriptionWrapperComponentMobile';
import {Api, ContentfulService} from '../../config/ApplicationContext';
import SpinCar from './SpinCar';
import ImageAsset from '../content/ImageAsset';
import MarkdownContent from '../content/MarkdownContent';
import DeviceTypeContext from '../../contexts/DeviceTypeContext';

class VehicleDetailComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicle: props.vehicle,
      leadsData: null,
      highlights: [
        {name: props.vehicle.configuration.transmissionType.name},
        {name: props.vehicle.configuration.model.engineType.name},
        {name: props.vehicle.configuration.model.estimatedMileage},
        {name: `Seats ${props.vehicle.configuration.model.seatingCapacity}`}
      ],
      subscriptionItemsData: null,
      isOnSubscription: false
    };

    this.handleFindSimilarCars = this.handleFindSimilarCars.bind(this);
    this.handleOptionChoosen = this.handleOptionChoosen.bind(this);
  }
  componentDidMount() {
    ContentfulService.getEntries({'sys.id': '1WheCspdpqEC86YWKG6QaQ'}).then((resp) => {
      this.setState({
        subscriptionItemsData: resp.items[0].fields
      });
    });
    this.createSubscriptionLead();
    Api.get('/subscription/options').then((response) => {
      this.setState({
        subscriptionOptions: response
      });
    });
  }
  createSubscriptionLead() {
    const request = {
      vehicleId: this.props.vehicle.id
    };
    Api.post('/subscription/leads', request).then((response) => {
      this.setState({leadsData: response});
    });
  }

  handleFindSimilarCars() {
    this.props.history.push({
      pathname: '/browse'
    });
  }

  handleOptionChoosen() {
    this.setState({isOnSubscription: true}, () => window.scrollTo(0, 0));
    this.props.updateFooterChange(false);
  }
  handleCarDetailLinkClick(data) {
    this.setState({
      isOnSubscription: data
    });
    this.props.updateFooterChange(!data);
    const errorsTemp = this.state.errors;
    errorsTemp.deliveryDate = false;
    errorsTemp.deliveryDateMessage = '';
    this.setState({
      errors: errorsTemp
    });
  }
  render() {
    if (!this.state.vehicle || !this.state.subscriptionItemsData || !this.state.leadsData || !this.state.subscriptionOptions) {
      return null;
    }

    const firstDeliveryDate = this.state.subscriptionOptions.deliveryDays[0];
    const deliveryDate = new Date(firstDeliveryDate.year, firstDeliveryDate.monthOfYear - 1, firstDeliveryDate.dayOfMonth, 12, 0, 0, 0);
    let rightSideComponent;
    let leftSideComponent;
    let chooseOptionPanel;
    if (this.state.vehicle.vehicleStatus === 'AVAILABLE') {
      const wrapperComponent = (
        <DeviceTypeContext.Consumer>
          {deviceContext => (deviceContext.isMobile ?
            <VehicleSubscriptionWrapperComponentMobile subscriptionOptions={this.state.subscriptionOptions} vehicle={this.state.vehicle} leadsData={this.state.leadsData} carDetailsLinkClick={(val) => { this.handleCarDetailLinkClick(val); }} /> :
            <VehicleSubscriptionWrapperComponent subscriptionOptions={this.state.subscriptionOptions} vehicle={this.state.vehicle} leadsData={this.state.leadsData} />
          )}
        </DeviceTypeContext.Consumer>
      );
      rightSideComponent = (
        <div>
          {wrapperComponent}
        </div>
      );
      leftSideComponent = (
        <div className="vehicle-detail-content">
          <div className="vehicle-detail-header">
            <div className="model-and-price">
              <input type="hidden" value={this.state.vehicle.id} />
              <h1 className="vehicle-model medium">{this.state.vehicle.configuration.model.year} {this.state.vehicle.configuration.model.name}</h1>
              <div className="vehicle-price grey-text">${this.state.vehicle.prices[0].basePrice}/month base price</div>
            </div>
            <div className="first-delivery-date">
              Get it delivered as soon as<br />
              <Moment className="date medium" date={deliveryDate} format="MMMM Do, YYYY" />
            </div>
          </div>
          <div className={`vehicle-image vin-${this.state.vehicle.vin}`}>
            <SpinCar spincarId={this.state.vehicle.spincarId} />
          </div>
          <div className="monthly-base-price medium">
            <span className="monthly-base-price-title ">Monthly Base Price</span>
            <span className="monthly-base-price-value">${this.state.vehicle.prices[0].basePrice}</span>
          </div>
          <div className="choose-options-text">Choose Options to view full price.</div>
          <div className="vehicle-highlights">
            <h2 className="medium">Highlights</h2>
            <div className="vehicle-highlights-list">
              {this.state.highlights.map((highlight) => {
                return (
                  <div key={highlight.name} className="list-item">
                    <VehicleHighlightItemComponent name={highlight.name} />
                  </div>
                );
              })}
            </div>
          </div>
          <div className="vehicle-includes">
            <h2 className="medium">Included with your subscription</h2>
            <div className="line-gradient mobile-gradient" />
            <div className="included-subscription">
              {this.state.subscriptionItemsData.subscriptionItems.map((data) => {
                return (
                  <div key={data.fields.title} className="included-item">
                    <ImageAsset image={data.fields.image} />
                    <h3 className="medium inclueded-item-title">{data.fields.title}</h3>
                    <p className="included-item-text small grey-text">
                      {data.fields.description}
                    </p>
                  </div>
                );
              })
              }
            </div>
          </div>
          <div className="vehicle-features">
            <h2 className="medium">More features</h2>
            <div className="line-gradient more-feature-line" />
            {this.state.vehicle.features.map((feature) => {
              return (
                <div className="feature-row" key={feature.imageStorageId}>
                  <div className="feature-detail left">
                    <h3 className="medium">{feature.title}</h3>
                    <div className="feature-description small">
                      <MarkdownContent markdown={feature.description} />
                    </div>
                  </div>
                  <div className="feature-image right" />
                </div>
              );
            })}
          </div>
        </div>
      );
      chooseOptionPanel = (
        <div className="choose-option-panel">
          <div className="choose-option-btn-container">
            <button className="csa-button primary" onClick={this.handleOptionChoosen}>Choose Options for this car</button>
          </div>
          <span className="fine-print grey-text medium" style={{padding: '10px'}}>You won&apos;t be charged yet</span>
        </div>
      );
    } else {
      rightSideComponent = (
        <div className="vehicle-unavailable-message">
          <div className="line-gradient" />
          <h2>Sorry! Someone else subscribed to this car</h2>
          <button className="csa-button primary" onClick={this.handleFindSimilarCars}>Find Similar Cars</button>
        </div>
      );
      leftSideComponent = (
        <div className="vehicle-detail-content">
          <div className="model-and-price">
            <input type="hidden" value={this.state.vehicle.id} />
            <h1 className="vehicle-model">{this.state.vehicle.configuration.model.year} {this.state.vehicle.configuration.model.name}</h1>
            <div className="vehicle-price">${this.state.vehicle.prices[0].basePrice}/month base price</div>
          </div>
          <div className="vehicle-image unavailable">
            <div className="vehicle-gone-label">
              <h2>Gone!</h2>
            </div>
            <img src={Api.resolve(`/media/${this.state.vehicle.imageStorageId}`)} alt="Vehicle Thumbnail" />
          </div>
        </div>
      );
      chooseOptionPanel = (
        <div className="choose-option-panel">
          <span className="choose-option-msg">Sorry! Someone else subscribed to this car</span>
          <div className="choose-option-btn-container not-available">
            <button className="csa-button primary" onClick={this.handleFindSimilarCars}>Find Similar Cars</button>
          </div>
        </div>
      );
    }

    return (
      <div className="vehicle-detail">
        <DeviceTypeContext.Consumer>
          {deviceContext => (deviceContext.isMobile ?
              (
                <div className="mobile-only">
                  <div className={!this.state.isOnSubscription ? '' : 'hide'}>
                    <BreadcrumbComponent pageName="vehiclepage" text="Cars" url="/browse" />
                    {leftSideComponent}
                    {chooseOptionPanel}
                  </div>
                  <div className={this.state.isOnSubscription ? '' : 'hide'}>
                    {rightSideComponent}
                  </div>
                </div>
              ) :
              (
                <div className="desktop-only">
                  <BreadcrumbComponent text="Back to Cars" url="/browse" />
                  {leftSideComponent}
                  {chooseOptionPanel}
                  {rightSideComponent}
                </div>
              )
          )}
        </DeviceTypeContext.Consumer>
        <div className="clear" />
      </div>
    );
  }
}

VehicleDetailComponent.contextType = DeviceTypeContext;
VehicleDetailComponent.propTypes = {
  vehicle: VehicleType.isRequired,
  updateFooterChange: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(VehicleDetailComponent);
