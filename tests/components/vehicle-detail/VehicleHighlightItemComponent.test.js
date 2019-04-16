import React from 'react';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import VehicleHighlightItemComponent from '../../../app/components/vehicle-detail/VehicleHighlightItemComponent';

configure({ adapter: new Adapter() });

describe('Vehicle Highlight Component', () => {
  let wrapper;
  const highlight = '32 MPG';

  beforeEach(() => {
    wrapper = mount(<VehicleHighlightItemComponent name={highlight} />);
  });

  it('should exist', () => {
    expect(wrapper).toBeTruthy();
  });

  it('should have vehicle highlight div with image and name', () => {
    expect(wrapper.find('div.vehicle-highlight')).toBeTruthy();

    expect(wrapper.find('div.vehicle-highlight').children().length).toEqual(2);

    expect(wrapper.find('div.vehicle-highlight').childAt(0).childAt(0).html()).toContain('<img src="[object Object]" alt="Highlight">');
    expect(wrapper.find('div.vehicle-highlight').childAt(1).html()).toContain('<div class="vehicle-highlight-text">32 MPG</div>');
  });
});
