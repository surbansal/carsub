import React, {Component} from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import './RemovePaymentMethodModal.scss';
import amex from '../../assets/images/americanexpress.png';
import discover from '../../assets/images/discover.png';
import masterCard from '../../assets/images/mastercard.png';
import visa from '../../assets/images/visa.png';

class RemovePaymentMethodModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: {
        'American Express': amex,
        Discover: discover,
        MasterCard: masterCard,
        Visa: visa
      },
      style: {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          padding: '0px',
          transform: 'translate(-50%, -50%)'
        }
      }
    };

    this.handleRemovePaymentPrompt = this.handleRemovePaymentPrompt.bind(this);
    this.getCardImage = this.getCardImage.bind(this);
  }
  getCardImage(brand) {
    return this.state.cards[brand];
  }
  handleRemovePaymentPrompt(event) {
    event.preventDefault();
    this.props.handleSubmit();
  }
  render() {
    const { showModal } = this.props;
    if (this.props.isDefaultCard) {
      return (
        <Modal
          isOpen={showModal}
          contentLabel="Remove Payment"
          style={this.state.style}
        >
          <form className="remove-payment-method-confirmation" onSubmit={this.handleRemovePaymentPrompt}>
            <div className="remove-payment-text">
              <span>This is your currently selected payment method.  To remove this card, please select or add another card as your default.</span>
            </div>
            <div className="action-field default-card">
              <button className="csa-button primary" onClick={this.props.handleNo}>Ok</button>
            </div>
          </form>
        </Modal>
      );
    } else if (this.props.selectedCardData) {
      return (
        <Modal
          isOpen={showModal}
          contentLabel="Remove Payment"
          style={this.state.style}
        >
          <form className="remove-payment-method-confirmation" onSubmit={this.handleRemovePaymentPrompt}>
            <div className="remove-payment-text">
              <span>Are you sure you want to remove this card?</span>
            </div>
            <div className="payment-card">
              <img src={this.getCardImage(this.props.selectedCardData.brand)} alt={this.props.selectedCardData.brand} className="card-img" />
              <div className="payment-info">
                <p className="card-detail">{this.props.selectedCardData.brand} Ending in {this.props.selectedCardData.last4}</p>
                <p className="card-expiry">Expires {this.props.selectedCardData.expiryMonth}/{this.props.selectedCardData.expiryYear.slice(-2)}</p>
              </div>
            </div>
            <div className="action-field">
              <button className="csa-button primary" type="submit">Yes,Remove it</button>
              <button className="csa-button primary not-now" onClick={this.props.handleNo}>No,Keep it</button>
            </div>
          </form>
        </Modal>
      );
    }
    return (
      <div />
    );
  }
}

RemovePaymentMethodModal.defaultProps = {
  selectedCardData: null,
};

RemovePaymentMethodModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleNo: PropTypes.func.isRequired,
  isDefaultCard: PropTypes.bool.isRequired,
  selectedCardData: PropTypes.shape({
    brand: PropTypes.string,
    last4: PropTypes.string,
    expiryMonth: PropTypes.string,
    expiryYear: PropTypes.string
  })
};
export default RemovePaymentMethodModal;
