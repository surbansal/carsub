import React from 'react';
import {configure, shallow} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import VehicleListComponent from '../../../app/components/vehicle-list/VehicleListComponent';
import Vehicle from '../utils/Vehicle';

configure({ adapter: new Adapter() });

describe('Vehicle List Component', () => {
  let wrapper;
  const vehicles = [Vehicle];

  beforeEach(() => {
    wrapper = shallow(<VehicleListComponent vehicles={vehicles} />);
  });

  it('should exist', () => {
    expect(wrapper).toBeTruthy();
  });

  it('should have div with correct class', () => {
    expect(wrapper.find('div.vehicle-list')).toBeTruthy();
  });

  it('should have div with 2 vehicle elements', () => {
    expect(wrapper.find('div.vehicle-list').children().length).toEqual(vehicles.length);
  });
});
