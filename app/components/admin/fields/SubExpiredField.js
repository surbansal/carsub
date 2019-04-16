import React from 'react';
// import get from 'lodash/get';
import PropTypes from 'prop-types';
import {
  BooleanField,
  BooleanInput,
  DateInput as RADateInput,
  DisabledInput,
  Labeled,
  TextField,
  TextInput
} from 'react-admin';
import DateInput from './DateInput';
import DateField from './DateField';

// eslint-disable-next-line object-curly-newline
const SubExpiredField = ({ record, label, type, ...rest }) => {
  if (type === 'disabledInput') {
    return <DisabledInput label={label} record={record} {...rest} InputProps={{ disableUnderline: true}} />;
  }
  if (type === 'disabledDate') {
    return <RADateInput label={label} record={record} {...rest} InputProps={{ disableUnderline: true}} disabled />;
  }
  if (record && !record.active) {
    let component;
    switch (type) {
      case 'bool':
        component = <BooleanField record={record} {...rest} />;
        break;
      case 'date':
        component = <DateField record={record} {...rest} />;
        break;
      default:
        component = <TextField record={record} {...rest} />;
        break;
    }
    return (
      <Labeled label={label}>
        {component}
      </Labeled>
    );
  }
  switch (type) {
    case 'bool':
      return <BooleanInput label={label} record={record} {...rest} />;
    case 'date':
      return <DateInput label={label} record={record} {...rest} />;
    default:
      return <TextInput label={label} record={record} {...rest} />;
  }
};

/* eslint-disable */
SubExpiredField.propTypes = {
  record: PropTypes.shape({}),
  label: PropTypes.string,
  type: PropTypes.string
};
/* eslint-enable */

export default SubExpiredField;
