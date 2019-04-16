import React, {Component} from 'react';
import Modal from 'react-modal';
import PropTypes from 'prop-types';
import './AddToHomescreenModal.scss';
import {ContentfulService} from '../../config/ApplicationContext';
import LoadingIndicator from '../LoadingIndicator';
import MarkdownContent from '../content/MarkdownContent';
import modalLogo from '../../assets/images/modal-logo.png';

class AddToHomescreenModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null,
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

    this.handleAddToHomePrompt = this.handleAddToHomePrompt.bind(this);
  }

  componentDidMount() {
    ContentfulService.getEntry('6j10QL0fYWGsQUoIyIGiO8').then((resp) => {
      this.setState({
        content: resp.fields
      });
    });
  }

  handleAddToHomePrompt(event) {
    event.preventDefault();
    this.props.handleSubmit();
  }

  render() {
    const { showModal } = this.props;
    let Content = () => <LoadingIndicator />;

    if (this.state.content) {
      const addHomescreenModal = this.state.content;
      Content = () => (
        <Modal
          isOpen={showModal}
          contentLabel="Add to Homescreen"
          style={this.state.style}
        >
          <form className="add-home-instructions" onSubmit={this.handleAddToHomePrompt}>
            <div className="header-info">
              <img src={modalLogo} alt="Modal Logo" />
              <h2>{addHomescreenModal.title}</h2>
            </div>
            <div>
              <MarkdownContent markdown={addHomescreenModal.description} />
            </div>
            <div className="action-field">
              <button className="csa-button primary" onClick={this.props.handleNo}>Not Right Now</button>
              <button className="csa-button primary action" type="submit">Yes</button>
            </div>
          </form>
        </Modal>
      );
    }

    return (
      <Content />
    );
  }
}

AddToHomescreenModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleNo: PropTypes.func.isRequired
};

export default AddToHomescreenModal;
