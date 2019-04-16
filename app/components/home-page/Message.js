import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './Message.scss';

class Message extends Component {
  render() {
    return (
      <div className="message" name="message">
        <div className="message-title"><h2 className="medium">{this.props.messageTitle}</h2></div>
        <div className="message-description"><p>{this.props.messageDescription}</p></div>
        <div className="line-gradient full-line" />
      </div>
    );
  }
}
Message.propTypes = {
  messageTitle: PropTypes.string.isRequired,
  messageDescription: PropTypes.string.isRequired,
};

export default Message;
