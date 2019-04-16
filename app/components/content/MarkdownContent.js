import React, {Component} from 'react';
import ReactHtmlParser from 'react-html-parser';
import marked from 'marked';
import PropTypes from 'prop-types';

class MarkdownContent extends Component {
  render() {
    if (this.props.markdown) {
      return (
        ReactHtmlParser(marked(this.props.markdown))
      );
    }
    return <span />;
  }
}

MarkdownContent.propTypes = {
  markdown: PropTypes.string
};

MarkdownContent.defaultProps = {
  markdown: null
};

export default MarkdownContent;
