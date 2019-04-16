import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ContentfulService} from '../../config/ApplicationContext';
import ImageComponent from './ImageComponent';

class ImageAsset extends Component {
  static canUseWebP() {
    if (ImageAsset.webPSupported !== null && ImageAsset.webPSupported !== undefined) {
      return ImageAsset.webPSupported;
    }
    const elem = document.createElement('canvas');

    if (elem.getContext && elem.getContext('2d')) {
      ImageAsset.webPSupported = elem.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    } else {
      ImageAsset.webPSupported = false;
    }
    return ImageAsset.webPSupported;
  }

  constructor() {
    super();
    this.state = {
      src: null
    };
  }

  componentDidMount() {
    const params = ImageAsset.canUseWebP() ? '?fm=webp' : '';
    ContentfulService.getAsset(this.props.image.sys.id).then((resp) => {
      this.setState({
        src: `https:${resp.fields.file.url}${params}`
      });
    });
  }

  render() {
    return (
      <div>
        { this.state.src ? <ImageComponent src={this.state.src} height={this.props.height} width={this.props.width} /> : '' }
      </div>
    );
  }
}

ImageAsset.propTypes = {
  image: PropTypes.shape({
    sys: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  height: PropTypes.string,
  width: PropTypes.string

};
ImageAsset.defaultProps = {
  height: 'auto',
  width: 'auto'
};

export default ImageAsset;
