import React, {Component, Fragment} from 'react';
import {ContentfulService} from '../../config/ApplicationContext';
import MarkdownContent from '../content/MarkdownContent';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';
import './PrivacyPolicyPage.scss';

class PrivacyPolicyPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null
    };
  }

  componentDidMount() {
    ContentfulService.getEntries({'sys.id': '1NhunxOhN24S4cqAeC28cc'}).then((resp) => {
      this.setState({
        content: resp.items[0].fields
      });
    });
  }

  render() {
    const privacyPolicyPage = this.state.content;
    if (!this.state.content) {
      return <div />;
    }
    return (
      <HeaderAndFooterPage>
        <div className="privacy-policy">
          <h1>Privacy Policy</h1>
          <br />
          {privacyPolicyPage.sections.map((section) => {
            return (
              <Fragment key={section.sys.id}>
                <h2> {section.fields.sectionNumber} &emsp; <u>{section.fields.header}</u></h2>
                <MarkdownContent markdown={section.fields.content} />
              </Fragment>
            );
          })}
        </div>
      </HeaderAndFooterPage>
    );
  }
}

export default PrivacyPolicyPage;
