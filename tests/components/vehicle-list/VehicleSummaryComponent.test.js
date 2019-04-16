import React from 'react';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import VehicleSummaryComponent from '../../../app/components/vehicle-list/VehicleSummaryComponent';
import Vehicle from '../utils/Vehicle';

configure({ adapter: new Adapter() });

describe('Vehicle Summary Component', () => {
  let wrapper;
  const pushFn = jest.fn();
  const history = {push: pushFn};

  beforeEach(() => {
    wrapper = mount(<VehicleSummaryComponent.WrappedComponent vehicle={Vehicle} history={history} />);
  });

  it('should exist', () => {
    expect(wrapper).toBeTruthy();
  });

  it('should have parent summary div', () => {
    expect(wrapper.find('div.vehicle-summary')).toBeTruthy();
  });

  it('should have make and model segment', () => {
    expect(wrapper.find('div.make-and-model')).toBeTruthy();
  });

  it('should have make and model data', () => {
    expect(wrapper.find('div.make-and-model').children().length).toEqual(2);

    expect(wrapper.find('div.make-and-model').childAt(0).html()).toEqual('<h1 class="vehicle-model">2015 Camry SE</h1>');
    expect(wrapper.find('div.make-and-model').childAt(1).html()).toEqual('<h2 class="vehicle-make">Toyota</h2>');
  });

  it('should display all features', () => {
    expect(wrapper.find('div.features').children().length).toEqual(6);

    expect(wrapper.find('div.features').getElement(0).props.children[0]).toEqual('White');
    expect(wrapper.find('div.features').getElement(0).props.children[3]).toEqual('Black');
    expect(wrapper.find('div.features').getElement(0).props.children[6]).toEqual('6-Speed Automatic');
    expect(wrapper.find('div.features').getElement(0).props.children[9]).toEqual('2.5L V4');
    expect(wrapper.find('div.features').getElement(0).props.children[12]).toEqual('32 MPG');
    expect(wrapper.find('div.features').getElement(0).props.children[16]).toEqual('5');
  });

  it('should have Check out button', () => {
    expect(wrapper.find('button.csa-button muted')).toBeTruthy();

    expect(wrapper.find('button.csa-button').html()).toEqual('<button class="csa-button muted">Check it out</button>');
  });
});
