import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './EasyToUse.scss';
import MarkdownContent from '../content/MarkdownContent';
import ImageAsset from '../content/ImageAsset';

class EasyToUse extends Component {
  render() {
    const {easyToUse} = this.props;
    return (
      <div className="easy-to-use">
        <h2 className="medium">{this.props.easyToUseTitle}</h2>
        <div className="easy-to-use-details">
          <div className="easy-to-use-categories">
            {easyToUse.map((category) => {
              return (
                <div key={category.sys.id} className="category">
                  <ImageAsset image={category.fields.image} height="250px" width="100%" />
                  <div className="category-description">
                    <h3 className="medium blue-text">{category.fields.title}</h3>
                    <span><MarkdownContent markdown={category.fields.description} /></span>
                    <small><MarkdownContent markdown={category.fields.footerDescription} /></small>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
EasyToUse.propTypes = {
  easyToUse: PropTypes.arrayOf(PropTypes.shape).isRequired,
  easyToUseTitle: PropTypes.string.isRequired
};
export default EasyToUse;
