import React, {Component} from 'react';
import {BigPlayButton, Player} from 'video-react';
import PropTypes from 'prop-types';
import {ContentfulService} from '../../config/ApplicationContext';
import ImageAsset from './ImageAsset';
import './VideoAsset.scss';

class VideoAsset extends Component {
  constructor() {
    super();
    this.playerRef = React.createRef();
    this.state = {
      videoSrc: null,
      posterImageSrc: null
    };
    this.handleStateChange = this.handleStateChange.bind(this);
  }

  componentDidMount() {
    this.playerRef.current.subscribeToStateChange(this.handleStateChange.bind(this));
    ContentfulService.getEntry(this.props.videoData.sys.id).then((resp) => {
      this.getAssets(resp);
    });
  }


  getAssets(req) {
    const params = ImageAsset.canUseWebP() ? '?fm=webp' : '';
    ContentfulService.getAsset(req.fields.posterImage.sys.id).then((response) => {
      this.setState({
        posterImageSrc: `https:${response.fields.file.url}${params}`
      });
    });
    ContentfulService.getAsset(req.fields.video.sys.id).then((response) => {
      this.setState({
        videoSrc: `https:${response.fields.file.url}`
      });
    });
  }


  handleStateChange(state, prevState) {
    if (!prevState.hasStarted && state.hasStarted) {
      this.props.onPlay();
    } else if (!prevState.paused && state.paused && !state.ended) {
      this.props.onPause();
    } else if (!prevState.ended && state.ended) {
      this.props.onEnd();
    } else if (prevState.paused && !state.paused) {
      this.props.onPlay();
    }
  }


  render() {
    return (
      <Player ref={this.playerRef} playsInline src={this.state.videoSrc} poster={this.state.posterImageSrc}>
        <BigPlayButton position="center" />
      </Player>
    );
  }
}
VideoAsset.propTypes = {
  videoData: PropTypes.shape({
    sys: PropTypes.shape({
      id: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onEnd: PropTypes.func

};
VideoAsset.defaultProps = {
  onPlay: () => {},
  onPause: () => {},
  onEnd: () => {}
};
export default VideoAsset;
