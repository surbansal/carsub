import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './ProgressBarComponent.scss';

class ProgressBarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  componentWillMount() {
    let percentage = (((this.props.actual - this.props.min) / (this.props.max - this.props.min)) * 100);
    percentage += '%';
    this.setState({value: percentage});
  }

  render() {
    const style = {
      width: (this.props.isUnlimited) ? '100%' : this.state.value
    };
    const progressDesc = this.props.isUnlimited ? (
      <div>
        <span className="progress-min">{`${Math.floor(this.props.actual)} to date`}</span>
      </div>
    ) : (
      <div>
        <span className="progress-min">{this.props.min} {this.props.unit}</span>
        <span className="progress-max">{this.props.max} {this.props.unit}</span>
      </div>
    );

    return (
      <div>
        <div className="progress-block">
          <div className="progress-bar" style={style} />
        </div>
        {progressDesc}
      </div>
    );
  }
}
ProgressBarComponent.propTypes = {
  unit: PropTypes.string.isRequired,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  actual: PropTypes.number.isRequired,
  isUnlimited: PropTypes.bool
};

ProgressBarComponent.defaultProps = {
  isUnlimited: false
};

export default ProgressBarComponent;
