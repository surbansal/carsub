import React from 'react';
import InputMask from 'react-input-mask';

class PhoneInputComponent extends React.Component {
  render() {
    return <InputMask {...this.props} mask="999-999-9999" maskChar=" " />;
  }
}
export default PhoneInputComponent;
