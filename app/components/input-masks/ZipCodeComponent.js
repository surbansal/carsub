import React from 'react';
import InputMask from 'react-input-mask';

class ZipCodeComponent extends React.Component {
  render() {
    return <InputMask {...this.props} mask="99999" maskChar="" alwaysShowMask="false" />;
  }
}
export default ZipCodeComponent;
