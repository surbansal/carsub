import React, {Component} from 'react';
import InputMask from 'react-input-mask';

class TwoDigitStateComponent extends Component {
  render() {
    return <InputMask {...this.props} mask="aa" maskChar=" " />;
  }
}


export default TwoDigitStateComponent;
