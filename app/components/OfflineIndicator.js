import React, {Component} from 'react';
import './OfflineIndicator.scss';
import offlineIcon from '../assets/images/offline-icon.png';

class OfflineIndicator extends Component {
  render() {
    return (
      <div className="offline-container">
        <div className="icon">
          <img src={offlineIcon} alt="footer-logo" />
        </div>
        <div className="message">
          Please check your network connection.
        </div>
      </div>
    );
  }
}

export default OfflineIndicator;
