import Modal from 'react-modal';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './ZipCodeModal.scss';
import ZipCode from '../input-masks/ZipCodeComponent';
import modalLogo from '../../assets/images/modal-logo.png';
import {segmentAnalytics} from '../../config/ApplicationContext';

class ZipCodeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      zipCode: '',
      style: {
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          width: '650px',
          marginRight: '-50%',
          padding: '0px',
          transform: 'translate(-50%, -50%)'
        }
      }
    };
  }
  componentDidMount() {
    Modal.setAppElement('body');
  }
  handleZipCodeChange(e) {
    this.setState({
      zipCode: e.target.value
    });
  }

  addZipCodeData(zip, e) {
    e.preventDefault();
    this.props.addZipCodeData(zip);
  }


  render() {
    const { showModal } = this.props;
    const analytics = showModal && this.state.zipCode === '' ?
      (
        segmentAnalytics.track('Shown Zipcode Modal', { category: 'Zipcode Modal', nonInteraction: 1})
      ) :
      ('');
    const invalidZipError = this.props.showError ? (
      <p className="error-message">Please enter a valid zip code</p>
    ) : null;
    return (
      <Modal
        isOpen={showModal}
        contentLabel="ZipCode Modal"
        style={this.state.style}
      >
        {invalidZipError}
        <form className="zip-code-modal" onSubmit={(e) => { this.addZipCodeData(this.state.zipCode, e); }}>
          <div className="header">
            <img src={modalLogo} alt="Modal Logo" />
            Welcome to Car Subscription
          </div>
          <div className="modal-content">
            <div className="description">
              To continue, please enter your Zip Code below.
            </div>
            <div className="action-field">
              <ZipCode className="block" value={this.state.zipCode} placeholder="Enter Zip Code" onChange={(e) => { this.handleZipCodeChange(e); }} />
              <button className="csa-button primary" type="submit" disabled={this.state.zipCode.length !== 5}>Go</button>
            </div>
            <p className="fine-print">
              This site serves residents of Alaska, Arizona, Northern California, Nevada, Montana, Utah & Wyoming
            </p>
          </div>
        </form>
        {analytics}

      </Modal>
    );
  }
}

ZipCodeModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  addZipCodeData: PropTypes.func.isRequired,
  showError: PropTypes.bool.isRequired
};

export default ZipCodeModal;
