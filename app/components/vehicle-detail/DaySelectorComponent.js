import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import moment from 'moment';
import './DaySelectorComponent.scss';
import arrowBack from '../../assets/images/arrow-back.png';
import arrowForward from '../../assets/images/arrow-fwd.png';

class DaySelectorComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      weekData: props.deliveryDays.map((day) => {
        const deliveryDate = moment(new Date(day.year, day.monthOfYear - 1, day.dayOfMonth));
        return {
          date: deliveryDate.format('YYYY-MM-DD'),
          dayOfWeek: deliveryDate.format('ddd'),
          month: deliveryDate.format('MMM'),
          dayOfMonth: deliveryDate.date()
        };
      }),
    };
  }

  render() {
    const settings = {
      dots: false,
      arrows: true,
      speed: 500,
      slidesToShow: 3,
      slidesToScroll: 3,
      infinite: false,
      prevArrow: <img className="arrow" src={arrowBack} alt="Arrow Back" />,
      nextArrow: <img className="arrow" src={arrowForward} alt="Arrow Forward" />,
      responsive: [{
        breakpoint: 1336,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }, {
        breakpoint: 980,
        settings: {
          arrows: false,
          slidesToShow: 4,
          slidesToScroll: 4
        }
      }]
    };
    const options = this.state.weekData.map((day) => {
      const isCurrent = this.props.deliveryOptions.deliveryDate === day.date;
      const dateId = `date-${day.dayOfMonth}`;
      return (
        <div key={day} className="day-slide" role="presentation" onClick={ () => { this.props.sendData(day.date); } } onKeyDown={ () => { this.props.sendData(day.date); } }>
          <label
            htmlFor={dateId}
            className={
              isCurrent ?
                'day-wrapper selected' :
                'day-wrapper'
              }
          >
            <span className="day-details"><b>{ day.dayOfWeek }</b><br /><span>{ day.month } { day.dayOfMonth }</span></span>
          </label>
        </div>
      );
    }).concat((
      <div key="pad-slider-for-right-scroll" />
    ));
    return (
      <Slider { ...settings }>
        { options }
      </Slider>
    );
  }
}

DaySelectorComponent.propTypes = {
  sendData: PropTypes.func.isRequired,
  deliveryDays: PropTypes.arrayOf(PropTypes.shape).isRequired,
  deliveryOptions: PropTypes.arrayOf(PropTypes.shape).isRequired
};

export default DaySelectorComponent;
