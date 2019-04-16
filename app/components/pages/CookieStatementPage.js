import React, {Component, Fragment} from 'react';
import {ContentfulService} from '../../config/ApplicationContext';
import MarkdownContent from '../content/MarkdownContent';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';
import './CookieStatementPage.scss';

class CookieStatementPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: null
    };
  }

  componentDidMount() {
    ContentfulService.getEntries({'sys.id': '6XgwIebYysAiCOuGuyQ2sm'}).then((resp) => {
      this.setState({
        content: resp.items[0].fields
      });
    });
  }

  render() {
    const cookieStatementPage = this.state.content;
    if (!this.state.content) {
      return <div />;
    }
    return (
      <HeaderAndFooterPage>
        <div className="cookie-statement">
          <h1><u>Cookie Statement</u></h1>
          <MarkdownContent markdown={cookieStatementPage.overview} />
          <br />
          {cookieStatementPage.sections.map((section) => {
            return (
              <Fragment key={section.sys.id}>
                <h2> {section.fields.sectionNumber} &emsp; {section.fields.header}</h2>
                <MarkdownContent markdown={section.fields.content} />
              </Fragment>
            );
          })}
        </div>
      </HeaderAndFooterPage>
    );
  }
}

export default CookieStatementPage;
