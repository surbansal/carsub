import React, {Component} from 'react';
import './LoadingIndicator.scss';

class LoadingIndicator extends Component {
  render() {
    return (
      <div className="loading-container">
        <div className="lds-ellipsis">
          <div />
          <div />
          <div />
          <div />
        </div>
      </div>
    );
  }
}

export default LoadingIndicator;
