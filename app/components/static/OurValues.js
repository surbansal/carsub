import React, { Component } from 'react';
import './OurValues.scss';
import MarkdownContent from '../content/MarkdownContent';
import {ContentfulService} from '../../config/ApplicationContext';
import HeroImageAsset from '../content/HeroImageAsset';

class OurValues extends Component {
  constructor() {
    super();
    this.state = {
      content: {
        ourValuesCategories: []
      }
    };
  }

  componentDidMount() {
    ContentfulService.getEntries({'sys.id': '4hmq1vrUykagCi22GW66AY'}).then((resp) => {
      this.setState({
        content: resp.items[0].fields
      });
    });
  }

  render() {
    const ourValues = this.state.content;
    return (
      <div className="our-values">
        <h2>{ourValues.header}</h2>
        <div className="our-values-details">
          <div className="our-values-categories">
            {ourValues.ourValuesCategories.map((category) => {
              return (
                <div key={category.sys.id} className="category">
                  <HeroImageAsset heroImage={category.fields.heroImage} title="false" />
                  <div className="category-description">
                    <h3>{category.fields.title}</h3>
                    <MarkdownContent markdown={category.fields.description} />
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

export default OurValues;
