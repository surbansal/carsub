import React, {Component} from 'react';
import {ContentfulService} from '../../config/ApplicationContext';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';
import LearnMore from '../static/LearnMore';
import HeroImageAsset from '../content/HeroImageAsset';
import './AboutUsPage.scss';
import MarkdownContent from '../content/MarkdownContent';
import LoadingIndicator from '../LoadingIndicator';

class AboutUsPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      content: null
    };
  }

  componentDidMount() {
    ContentfulService.getEntry('1YO9UZTyPmsOOQ4sMeWiQ').then((resp) => {
      this.setState({
        content: resp.fields
      });
    });
  }

  render() {
    let Content = () => <LoadingIndicator />;
    if (this.state.content) {
      const aboutUsPage = this.state.content;
      Content = () => (
        <div className="about-us-page">
          <div className="header-info">
            <h1>{aboutUsPage.title}</h1>
          </div>
          <div className="image">
            <HeroImageAsset heroImage={aboutUsPage.heroImage} height="486px" width="100%" title="true" />
          </div>
          <MarkdownContent markdown={aboutUsPage.description} />
          <div className="line" />
          <LearnMore />
        </div>
      );
    }
    return (
      <HeaderAndFooterPage>
        <Content />
      </HeaderAndFooterPage>
    );
  }
}
export default AboutUsPage;
