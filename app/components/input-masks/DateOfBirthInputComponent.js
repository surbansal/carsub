import React from 'react';
import InputMask from 'react-input-mask';

class DateOfBirthInputComponent extends React.Component {
  static formatDate(date) {
    const fields = date.split('/');
    return `${(`0${fields[0]}`).slice(-2)}/${(`0${fields[1]}`).slice(-2)}/${(`0${fields[2]}`).slice(-4)}`;
  }

  static formatAutoFill(newState, oldState, userInput) {
    if (userInput && userInput.split('/').length === 3) {
      const maskedValue = {};
      maskedValue.value = DateOfBirthInputComponent.formatDate(userInput);
      maskedValue.selection = {};
      maskedValue.selection.end = 10;
      maskedValue.selection.start = 10;
      return maskedValue;
    }
    return newState;
  }

  render() {
    return <InputMask {...this.props} mask="99/99/9999" maskChar=" " beforeMaskedValueChange={DateOfBirthInputComponent.formatAutoFill} />;
  }
}
export default DateOfBirthInputComponent;
