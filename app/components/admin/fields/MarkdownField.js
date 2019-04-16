import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactMDE from 'redux-forms-markdown-editor';
import {Field} from 'redux-form';


class MarkdownField extends Component {
  render() {
    const buttonConfig = {
      bold: true,
      italic: true,
      heading: true,
      orderedList: true,
      unorderedList: true,
      canPreview: true
    };
    return (
      <Field name={this.props.source} component={ReactMDE} buttonConfig={buttonConfig} />
    );
  }
}

/* eslint-disable */
MarkdownField.propTypes = {
  source: PropTypes.string.isRequired,
  addLabel: PropTypes.bool
};
/* eslint-enable */
MarkdownField.defaultProps = {
  addLabel: true,
};

export default MarkdownField;
