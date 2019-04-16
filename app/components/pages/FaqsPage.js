import React, {Component, Fragment} from 'react';
import PropTypes from 'prop-types';
import {Accordion, AccordionItem, AccordionItemBody, AccordionItemTitle} from 'react-accessible-accordion';
import {ContentfulService} from '../../config/ApplicationContext';
import BreadcrumbComponent from '../BreadcrumbComponent';
import HeaderAndFooterPage from '../layout/HeaderAndFooterPage';
import HeroImageAsset from '../content/HeroImageAsset';
import LearnMore from '../static/LearnMore';
import skyBlueArrowRight from '../../assets/images/a3-right-arrow.png';
import './FaqsPage.scss';
import MarkdownContent from '../content/MarkdownContent';
import LoadingIndicator from '../LoadingIndicator';

class FaqsPage extends Component {
  constructor(props) {
    super(props);
    const params = new URLSearchParams(this.props.location.search);
    this.state = {
      content: null,
      categories: [],
      currentCategory: null,
      isSubscriber: Boolean(params.get('subscriber')),
      questionIdParam: this.props.match.params.questionId
    };
    this.showCategoryQuestions = this.showCategoryQuestions.bind(this);
  }

  componentDidMount() {
    const {isSubscriber} = this.state;
    ContentfulService.getEntries({ 'sys.id': '1Mux7qhnIcgmIyegCgaSoU', include: 5 }).then((resp) => {
      let categoryIndex = 0;
      const respContent = {
        heroImage: resp.items[0].fields.heroImage,
        title: resp.items[0].fields.title,
        description: resp.items[0].fields.description,
        categories: resp.items[0].fields.faqsCategories
      };
      const filteredCategories = respContent.categories.filter((category) => {
        return !(category.fields.subscriberOnly === true && isSubscriber !== true);
      });
      const categoriesWithFilteredQuestions = filteredCategories.map((category) => {
        const withFilteredQuestions = {...category};
        withFilteredQuestions.fields.questions = withFilteredQuestions.fields.questions.filter((question) => {
          return !(question.fields.subscriberOnly === true && isSubscriber !== true);
        });
        return withFilteredQuestions;
      });
      if (this.props.match.params.categoryId) {
        categoryIndex = filteredCategories.findIndex((category) => {
          const withFilteredQuestions = {...category};
          return this.props.match.params.categoryId === withFilteredQuestions.sys.id;
        });
      }
      this.setState({
        content: respContent,
        currentCategory: (window.innerWidth > 980) ? categoriesWithFilteredQuestions[categoryIndex] : null,
        categories: categoriesWithFilteredQuestions
      }, () => {
        this.showCategoryQuestions(this.state.currentCategory);
      });
    });
  }

  setUrl() {
    if (!window.history || !window.history.pushState) {
      return;
    }
    if (this.state.currentCategory && this.state.questionIdParam) {
      window.history.pushState('', '', `/faqs/categories/${this.state.currentCategory.sys.id}/questions/${this.state.questionIdParam}`);
    } else if (this.state.currentCategory) {
      window.history.pushState('', '', `/faqs/categories/${this.state.currentCategory.sys.id}`);
    } else {
      window.history.pushState('', '', '/faqs');
    }
  }

  selectQuestion(question) {
    window.history.pushState('', '', '/foo');
    this.setState({
      questionIdParam: question.sys.id
    }, () => {
      this.setUrl();
    });
  }

  showCategoryQuestions(category) {
    this.setState({
      currentCategory: category
    }, () => {
      this.setUrl();
    });
  }


  render() {
    let Content = () => <LoadingIndicator />;
    if (this.state.content) {
      const faqsPage = this.state.content;
      Content = () => (
        <Fragment>
          <div className={this.state.currentCategory ? 'faqs-page has-category-selected' : 'faqs-page'}>
            <div className="header-info">
              <h1>{faqsPage.title}</h1>
            </div>
            <div className="image">
              <HeroImageAsset heroImage={faqsPage.heroImage} height="486px" width="100%" title="true" />
            </div>
            <div className="faqs-details">
              <div className="category">
                <div className="category-list">
                  <ul>
                    {this.state.categories.map((category) => {
                      return (
                        <li key={category.sys.id} className="h3">
                          <span className={category === this.state.currentCategory ? 'category-label-black medium' : 'a medium'} tabIndex="0" role="button" onKeyUp={() => this.showCategoryQuestions(category) } onClick={() => this.showCategoryQuestions(category) }>
                            {category.fields.title}
                            <img className="arrow" src={skyBlueArrowRight} alt="arrow right" />
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="question">
                <BreadcrumbComponent text="FAQ's" url="/faqs" onClick={() => this.setState({currentCategory: null})} />
                <h3 className="question-title medium"> {(this.state.currentCategory) ? this.state.currentCategory.fields.title : null} </h3>
                {(this.state.currentCategory) ? this.state.currentCategory.fields.questions.map((question) => {
                  return (
                    <div className="question-list-item" key={question.sys.id}>
                      <Accordion>
                        <AccordionItem expanded={this.state.questionIdParam === question.sys.id} onClick={() => this.selectQuestion(question)}>
                          <AccordionItemTitle>
                            <h3 className="q-label medium">{question.fields.question}</h3>
                          </AccordionItemTitle>
                          <AccordionItemBody>
                            <span className="grey-text"><MarkdownContent markdown={question.fields.answer} /></span>
                          </AccordionItemBody>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  );
                }) : null}
              </div>
            </div>
            <div className="line" />
            <LearnMore />
          </div>
        </Fragment>
      );
    }
    return (
      <HeaderAndFooterPage>
        <Content />
      </HeaderAndFooterPage>
    );
  }
}

FaqsPage.propTypes = {
  location: PropTypes.shape({
    search: PropTypes.string.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      categoryId: PropTypes.string,
      questionId: PropTypes.string
    }).isRequired
  })
};
FaqsPage.defaultProps = {
  match: null
};


export default FaqsPage;
