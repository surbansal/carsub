import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';

import PropTypes from 'prop-types';
import MarkdownContent from '../content/MarkdownContent';
import ImageAsset from '../content/ImageAsset';
import {segmentAnalytics} from '../../config/ApplicationContext';
import './LeasePurchase.scss';

class LeasePurchase extends Component {
  render() {
    return (
      <div className="lease-purchase">
        <div className="lease-purchase-details">
          <div className="lease-purchase-container">
            {this.props.leasePurchaseData.map((data) => {
              return (
                <div key={data.sys.id} className="lease-purchase-content">
                  <h2><MarkdownContent markdown={data.fields.title} /></h2>
                  <div className="description">
                    {data.fields.shouldShowBrowseButton === true ?
                    (
                      <div className="new-way-description">
                        <div className="tick-icon">
                          <ImageAsset image={data.fields.image} />
                        </div>
                        <div className="new-way-text">
                          <MarkdownContent markdown={data.fields.description} />
                        </div>
                        <button className="csa-button primary how-it-works-button" onClick={() => { segmentAnalytics.track('', {category: 'See Cars & Costs'}); this.props.history.push({pathname: '/browse'}); }}>{data.fields.buttonText}</button>
                        <div className="line-gradient line-strech-new-way" />
                      </div>) :
                    (
                      <div>
                        <MarkdownContent markdown={data.fields.description} />
                        <hr />
                        <h2>{data.fields.footerDescription}</h2>
                        <div className="line-gradient line-strech-old-way" />
                      </div>
                    )}
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
LeasePurchase.propTypes = {
  leasePurchaseData: PropTypes.arrayOf(PropTypes.shape).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(LeasePurchase);
