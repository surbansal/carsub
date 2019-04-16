import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './TimeFrameSelectorComponent.scss';
import TimeFrameType from '../../types/TimeFrameType';

class TimeFrameSelectorComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeFrameOptions: props.timeFrameOptions,
      selectedTimeFrame: -1
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      timeFrameOptions: nextProps.timeFrameOptions
    });
  }

  handleRadio(e) {
    const timeFrame = this.state.timeFrameOptions.find((option) => {
      return `${option.id}` === e.target.value;
    });
    this.setState({
      selectedTimeFrame: e.target.value
    });
    this.props.sendData(timeFrame);
  }
  render() {
    const {selectedTimeFrame, timeFrameOptions} = this.state;
    const options = timeFrameOptions.map((time) => {
      const isCurrent = selectedTimeFrame === `${time.id}`;
      return (
        <div key={time.id} className="time-frame">
          <div>
            <label htmlFor={`time-frame-${time.id}`} className={isCurrent ? 'time-frame-wrapper selected' : 'time-frame-wrapper'}>
              <input
                className="time-frame-radio"
                type="radio"
                name="time-frame"
                id={ `time-frame-${time.id}` }
                value={ time.id }
                onChange={ (e) => { this.handleRadio(e); } }
              />
              { time.displayName }
            </label>
          </div>
        </div>
      );
    });
    return (
      <div className="container text-center">
        <div className="row">
          { options }
        </div>
      </div>
    );
  }
}

TimeFrameSelectorComponent.propTypes = {
  sendData: PropTypes.func.isRequired,
  timeFrameOptions: PropTypes.arrayOf(TimeFrameType.isRequired).isRequired
};


export default TimeFrameSelectorComponent;
