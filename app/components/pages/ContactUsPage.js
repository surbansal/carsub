import React, {Component, Fragment} from 'react';
import {ContentfulService} from '../../config/ApplicationContext';
import MarkdownContent from '../content/MarkdownContent';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';
import './ContactUsPage.scss';

class ContactUsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null
    };
  }

  componentDidMount() {
    ContentfulService.getEntries({'sys.id': 'lEknOvILOowqqoISsEWsa'}).then((resp) => {
      this.setState({
        content: resp.items[0].fields
      });
    });
  }

  render() {
    const contactUsPage = this.state.content;
    if (!this.state.content) {
      return <div />;
    }
    return (
      <HeaderAndFooterPage className="contact-us">
        <div>
          <h1>Contact Us</h1>
          <br />
          {contactUsPage.mobileViewSections.map((section) => {
            return (
              <Fragment key={section.sys.id}>
                <div className="link-section-mobile mobile-only">
                  <MarkdownContent markdown={section.fields.content} />
                </div>
              </Fragment>
            );
          })}
          {contactUsPage.sections.map((section) => {
            return (
              <div className="desktop-only" key={section.sys.id}>
                <MarkdownContent className="desktop-only" markdown={section.fields.content} />
              </div>
            );
          })}
        </div>
      </HeaderAndFooterPage>
    );
  }
}

export default ContactUsPage;
