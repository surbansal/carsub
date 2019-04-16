import React, {Component, Fragment} from 'react';
import './TermsAndConditionsPage.scss';
import {ContentfulService} from '../../config/ApplicationContext';
import MarkdownContent from '../content/MarkdownContent';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';

class TermsAndConditionsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null
    };
  }

  componentDidMount() {
    ContentfulService.getEntries({'sys.id': '6lukzeminmcsOQuIsQsiiG'}).then((resp) => {
      this.setState({
        content: resp.items[0].fields
      });
    });
  }

  render() {
    const termsAndConditionsPage = this.state.content;
    if (!this.state.content) {
      return <div />;
    }
    return (
      <HeaderAndFooterPage>
        <div className="terms-and-conditions">
          <h2><u>TERMS &amp; CONDITIONS</u></h2>
          <MarkdownContent markdown={termsAndConditionsPage.overview} />
          <br />
          {termsAndConditionsPage.sections.map((section) => {
            return (
              <Fragment key={section.sys.id}>
                <h3>{section.fields.header}</h3>
                <MarkdownContent markdown={section.fields.content} />
              </Fragment>
            );
          })}
          <div className="exhibit">
            <b className="center-txt"><u>{termsAndConditionsPage.exhibitATitle}</u></b>
            <h3 className="center-txt">{termsAndConditionsPage.exhibitASubTitle}</h3>
            {termsAndConditionsPage.exhibitASections.map((section) => {
              return (
                <Fragment key={section.sys.id}>
                  <b>{section.fields.sectionNumber} &emsp;<u>{section.fields.header}</u></b>
                  <MarkdownContent markdown={section.fields.content} />
                </Fragment>
              );
            })}
            <b className="center-txt"><u>{termsAndConditionsPage.exhibitBTitle}</u></b>
            <h3 className="center-txt">{termsAndConditionsPage.exhibitBSubTitle}</h3>
            {termsAndConditionsPage.exhibitBSections.map((section) => {
              return (
                <Fragment key={section.sys.id}>
                  <b >{section.fields.sectionNumber} &emsp;<u>{section.fields.header}</u></b>
                  <MarkdownContent markdown={section.fields.content} />
                </Fragment>
              );
            })}
          </div>
        </div>
      </HeaderAndFooterPage>
    );
  }
}

export default TermsAndConditionsPage;
