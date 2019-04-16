import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './HowItWork.scss';
import ImageAsset from '../content/ImageAsset';
import MarkdownContent from '../content/MarkdownContent';
import verticalRoad from '../../assets/images/vertical-road.png';

class HowItWork extends Component {
  static getDocumentHeight() {
    const w = window;
    const d = document;
    const e = d.documentElement;
    const g = d.getElementsByTagName('body')[0];
    return w.innerHeight || e.clientHeight || g.clientHeight;
  }

  constructor(props) {
    super(props);
    this.state = {
      howItWorkData: this.props.howItWorkData,
      leftMarginEven: '0%',
      leftMarginOdd: '0%',
      isMobileDevice: false,
      maximumHowItWorksSection: -1
    };
    this.roadRef = React.createRef();
    this.updateDimensions = this.updateDimensions.bind(this);
    this.onComponentScroll = this.onComponentScroll.bind(this);
  }

  componentDidMount() {
    this.makeRoad(this.state.howItWorkData.length - 1);
    this.updateDimensions();
    window.addEventListener('resize', this.updateDimensions);
    window.addEventListener('scroll', this.onComponentScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
    window.removeEventListener('scroll', this.onComponentScroll);
  }

  onComponentScroll() {
    const height = HowItWork.getDocumentHeight();
    const divs = document.getElementsByClassName('info-sec');
    let maximumHowItWorksSection = -1;
    for (let i = 0; i < divs.length; i += 1) {
      const rect = divs[i].getBoundingClientRect();
      const bottomY = rect.y + rect.height;
      if (bottomY < height * 0.9) {
        maximumHowItWorksSection = i;
      } else {
        break;
      }
    }
    this.setState({maximumHowItWorksSection});
  }


  makeRoad(numberOfPath) {
    const ctx = this.roadRef.current.getContext('2d');
    this.roadRef = React.createRef();
    ctx.strokeStyle = '#D7D8D9';
    const distanceToAdd = 220;
    let xFrom = 0;
    let xTo = 360;
    let rightLine = 170;
    let leftLine = 191;
    let middleLine = 180;
    for (let i = 0; i < numberOfPath; i += 1) {
      if (i % 2 === 0) {
        xFrom = 0;
        xTo = 360;
      } else {
        xFrom = 360;
        xTo = 0;
      }
      ctx.beginPath();
      ctx.lineWidth = 16;
      ctx.setLineDash([]);
      ctx.moveTo(xFrom, rightLine);
      rightLine += distanceToAdd;
      ctx.lineTo(xTo, rightLine);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(xFrom, leftLine);
      leftLine += distanceToAdd;
      ctx.lineTo(xTo, leftLine);
      ctx.stroke();
      ctx.closePath();
      ctx.beginPath();
      ctx.moveTo(xFrom, middleLine);
      middleLine += distanceToAdd;
      ctx.lineWidth = 8;
      ctx.lineTo(xTo, middleLine);
      ctx.setLineDash([10, 10]);
      ctx.stroke();
      ctx.closePath();
    }
  }
  updateDimensions() {
    if (window.innerWidth <= 980) {
      const tempState = this.state;
      tempState.leftMarginEven = '0%';
      tempState.leftMarginOdd = '0%';
      tempState.isMobileDevice = true;
      this.setState(tempState);
    } else if (window.innerWidth > 980 && window.innerWidth <= 1124) {
      const tempState = this.state;
      tempState.leftMarginEven = '8%';
      tempState.leftMarginOdd = '59%';
      tempState.isMobileDevice = false;
      this.setState(tempState);
    } else if (window.innerWidth > 1124 && window.innerWidth <= 1424) {
      const tempState = this.state;
      tempState.leftMarginEven = '16%';
      tempState.leftMarginOdd = '59%';
      tempState.isMobileDevice = false;
      this.setState(tempState);
    } else if (window.innerWidth > 1424 && window.innerWidth <= 1564) {
      const tempState = this.state;
      tempState.leftMarginEven = '19%';
      tempState.leftMarginOdd = '59%';
      tempState.isMobileDevice = false;
      this.setState(tempState);
    } else if (window.innerWidth > 1564 && window.innerWidth <= 2024) {
      const tempState = this.state;
      tempState.leftMarginEven = '26%';
      tempState.leftMarginOdd = '56%';
      tempState.isMobileDevice = false;
      this.setState(tempState);
    } else {
      const tempState = this.state;
      tempState.leftMarginEven = '32%';
      tempState.leftMarginOdd = '55%';
      tempState.isMobileDevice = false;
      this.setState(tempState);
    }
  }
  render() {
    if (this.state.howItWorkData) {
      return (
        <div className="how-it-work-container">
          <h2 className="medium">{this.props.howItWorksTitle}</h2>
          <div className="how-it-work">
            {this.state.howItWorkData.map((data, index) => {
                  let topMargin;
                  let leftMargin;
                  if (index === 0) {
                    topMargin = '14px';
                    leftMargin = this.state.leftMarginEven;
                  } else if (index % 2 === 0) {
                    topMargin = '-130px';
                    leftMargin = this.state.leftMarginEven;
                  } else {
                    topMargin = '-130px';
                    leftMargin = this.state.leftMarginOdd;
                  }
                  return (
                    <div key={data.fields.title} className="info-card" style={this.state.isMobileDevice ? {padding: '0px'} : {marginTop: topMargin, marginLeft: leftMargin}}>
                      <div id={`info${index}`} className="info-sec">
                        <div className="info-data">
                          <ImageAsset image={data.fields.image} />
                          <h3 className="medium">{data.fields.title}</h3>
                          <span className="small grey-text"><MarkdownContent markdown={data.fields.description} /></span>
                          <small><MarkdownContent markdown={data.fields.footerDescription} /></small>
                        </div>
                      </div>
                      <div className={index <= this.state.maximumHowItWorksSection ? 'line-gradient line-width show' : 'line-gradient line-width'} />
                      <img src={verticalRoad} alt="" className={this.state.isMobileDevice && index < this.state.howItWorkData.length - 1 ? 'vertical-road' : 'hide'} />
                    </div>
                  );
                })}
          </div>
          <canvas ref={this.roadRef} className={this.state.isMobileDevice ? 'hide' : ''} width={360} height={270 * this.state.howItWorkData.length} />
        </div>
      );
    }
    return null;
  }
}
HowItWork.propTypes = {
  howItWorkData: PropTypes.arrayOf(PropTypes.shape).isRequired,
  howItWorksTitle: PropTypes.string.isRequired
};
export default HowItWork;
