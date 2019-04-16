import React, {Component} from 'react';
import PropTypes from 'prop-types';
import objectFitImages from 'object-fit-images';

class ImageComponent extends Component {
  componentDidMount() {
    objectFitImages();
  }
  render() {
    const style = {
      objectFit: this.props.objectFit,
      objectPosition: this.props.objectPosition,
      width: this.props.width,
      height: this.props.height,
      fontFamily: 'objectFit: cover',
    };
    return (
      <div className="crop">
        <img src={this.props.src} alt="img" style={style} />
      </div>
    );
  }
}
ImageComponent.propTypes = {
  src: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  objectFit: PropTypes.string,
  objectPosition: PropTypes.string,
};
ImageComponent.defaultProps = {
  objectFit: 'cover',
  objectPosition: '50 50',
};
export default ImageComponent;
