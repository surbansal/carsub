import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './PasswordEntryComponent.scss';

class PasswordEntryComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'password',
    };
    this.showHide = this.showHide.bind(this);
  }
  showHide() {
    this.setState({
      type: this.state.type === 'input' ? 'password' : 'input'
    });
  }
  handlePasswordChange(e) {
    this.props.sendData(e.target.value);
  }
  render() {
    return (
      <span>
        <label className="password">{ this.props.label }
          <input name="password" type={this.state.type} className={ this.props.isError ? 'error password-input' : 'password-input'} onChange={(e) => { this.handlePasswordChange(e); }} />
          <span role="button" tabIndex="-1" className="password-show" onClick={this.showHide} onKeyDown={this.showHide}> {this.state.type === 'input' ? 'HIDE' : 'SHOW'}</span>
        </label>
        <p className={ this.props.isError ? 'error-message' : 'hide-error'}>{ this.props.errorMessage }</p>
      </span>
    );
  }
}
PasswordEntryComponent.propTypes = {
  sendData: PropTypes.func.isRequired,
  isError: PropTypes.bool,
  errorMessage: PropTypes.string,
  label: PropTypes.string
};
PasswordEntryComponent.defaultProps = {
  isError: false,
  errorMessage: '',
  label: 'Password'
};
export default PasswordEntryComponent;
