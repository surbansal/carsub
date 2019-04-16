import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';
import './LearnMore.scss';
import {ContentfulService} from '../../config/ApplicationContext';
import MarkdownContent from '../content/MarkdownContent';
import ImageAsset from '../content/ImageAsset';

class LearnMore extends Component {
  constructor() {
    super();
    this.state = {
      content: {
        learnMoreCategories: []
      }
    };
  }


  componentDidMount() {
    ContentfulService.getEntries({'sys.id': '3ceHynpeFqm0AeKG0Asq0M'}).then((resp) => {
      this.setState({
        content: resp.items[0].fields
      });
    });
  }


  render() {
    const learnMore = this.state.content;
    return (
      <div className="learn-more">
        <h2>{learnMore.header}</h2>

        <div className="learn-more-details">
          <div className="learn-more-categories">
            {learnMore.learnMoreCategories.filter((category) => {
              return window.location.href.indexOf(category.fields.link) < 0;
            }).map((category) => {
              return (
                <div key={category.sys.id} className="category">
                  <div className="category-image" >
                    <ImageAsset image={category.fields.image} />
                  </div>
                  <div className="category-description">
                    <h3 className="medium blue-text">{category.fields.title}</h3>
                    <span className="small grey-text"><MarkdownContent markdown={category.fields.description} /></span>
                    <a className="small" href={category.fields.link}>Check it out</a>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="contact-us">
            <div className="contact-us-box">
              {learnMore.contactUsImage !== undefined ?
              (<ImageAsset image={learnMore.contactUsImage} height="100px" width="100px" />) : ''}
              <h2>{learnMore.contactUsHeader}</h2>
              <button className="csa-button primary" onClick={() => { this.props.history.push({pathname: '/contact-us'}); }}>{learnMore.contactUsButtonText}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

LearnMore.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired
};

export default withRouter(LearnMore);
