import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import {ContentfulService} from '../../config/ApplicationContext';
import './HeroImageAsset.scss';
import ImageComponent from './ImageComponent';
import ImageAsset from './ImageAsset';

class HeroImageAsset extends Component {
  constructor() {
    super();
    this.state = {
      title: null,
      description: null,
      src: null,
    };
  }

  componentDidMount() {
    ContentfulService.getEntry(this.props.heroImage.sys.id).then((resp) => {
      const tempState = this.state;
      tempState.title = resp.fields.title;
      tempState.description = resp.fields.description;
      this.setState(tempState);
      this.getAsset(resp);
    });
  }
  getAsset(req) {
    const params = ImageAsset.canUseWebP() ? '?fm=webp' : '';
    ContentfulService.getAsset(req.fields.image.sys.id).then((response) => {
      const tempState = this.state;
      tempState.src = `https:${response.fields.file.url}${params}`;
      this.setState(tempState);
    });
  }

  render() {
    return (
      <div>
        <div className={`image-holder ${this.props.type} desktop-only`}>
          <div className={this.props.title === 'true' && this.props.type !== 'home' ? 'line-gradient hero-line-spacing' : 'hide'} />
          <div className="hero-container">
            <h1 className={this.props.title === 'true' && this.props.type !== 'home' ? 'top-left medium' : 'hide medium'}>{this.state.title}</h1>
            { this.state.src ? <ImageComponent src={this.state.src} height={this.props.height} width={this.props.width} /> : '' }
          </div>
          <div className={this.props.title === 'true' && this.props.type === 'home' ? 'subscribe-and-drive' : 'hide'}>
            <h1 className="medium">{this.state.title}</h1>
            <p>{this.state.description}</p>
            <button className="csa-button primary" onClick={() => this.props.scrollTo()}>Learn More &darr;</button>
          </div>
          <div className={this.props.title === 'true' && this.props.type === 'home' ? 'line-gradient hero-line-spacing' : 'hide'} />
        </div>
        <div className="mobile-only">
          <div>
            <div className="hero-container-mobile">
              <div className={this.props.title === 'true' && this.props.type !== 'home' ? 'line-gradient hero-line-spacing' : 'hide'} />
              { this.state.src ? <ImageComponent src={this.state.src} height="338px" width={this.props.width} objectFit="scale-down" objectPosition="0 0" /> : '' }
            </div>
          </div>
          <div className={this.props.title === 'true' && this.props.type === 'home' ? 'subscribe-and-drive subscribe-text' : 'hide'}>
            <h1 className="medium">{this.state.title}</h1>
            <p className="description-mobile">{this.state.description}</p>
            <Link className="learn-more" to="/" onClick={() => this.props.scrollTo()}> Learn More &darr;</Link>
          </div>
          <div className={this.props.title === 'true' && this.props.type === 'home' ? 'line-gradient hero-line-spacing' : 'hide'} />
        </div>
      </div>
    );
  }
}

HeroImageAsset.propTypes = {
  heroImage: PropTypes.shape({
    sys: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  title: PropTypes.string,
  type: PropTypes.string,
  scrollTo: PropTypes.func,
  height: PropTypes.string,
  width: PropTypes.string
};
HeroImageAsset.defaultProps = {
  title: 'false',
  type: 'faq',
  scrollTo: () => {},
  height: 'auto',
  width: 'auto'

};

export default HeroImageAsset;
