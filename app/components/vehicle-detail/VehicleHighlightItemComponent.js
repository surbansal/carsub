import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './VehicleHighlightItemComponent.scss';

class VehicleHighlightItemComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name
    };
  }

  render() {
    return (
      <div className="vehicle-highlight">
        <div className="icon"><span className="dot" /></div>
        <div className="vehicle-highlight-text">{this.state.name}</div>
      </div>
    );
  }
}

VehicleHighlightItemComponent.propTypes = {
  name: PropTypes.string.isRequired,
};

export default VehicleHighlightItemComponent;
