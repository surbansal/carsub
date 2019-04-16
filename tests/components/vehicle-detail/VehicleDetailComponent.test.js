import React from 'react';
import {configure, mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import VehicleDetailComponent from '../../../app/components/vehicle-detail/VehicleDetailComponent';
import Vehicle from '../utils/Vehicle';
import BreadcrumbComponent from '../../../app/components/BreadcrumbComponent';
import VehicleHighlightItemComponent from '../../../app/components/vehicle-detail/VehicleHighlightItemComponent';

configure({ adapter: new Adapter() });

describe('Vehicle Detail Component', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(<VehicleDetailComponent vehicle={Vehicle} />);
  });

  it('should exist', () => {
    expect(wrapper).toBeTruthy();
  });

  it('should have link back to Vehicle List', () => {
    expect(wrapper.find(BreadcrumbComponent)).toBeTruthy();

    expect(wrapper.find(BreadcrumbComponent).length).toEqual(1);
    expect(wrapper.find(BreadcrumbComponent).text()).toContain('Back to Cars');
  });

  it('should have Vehicle Model and Hidden ID', () => {
    expect(wrapper.find('div.model-and-price')).toBeTruthy();

    expect(wrapper.find('div.model-and-price').children().length).toEqual(3);
    expect(wrapper.find('div.model-and-price').childAt(0).html()).toEqual('<input type="hidden" value="1">');
    expect(wrapper.find('div.model-and-price').childAt(1).html()).toEqual('<h1 class="vehicle-model">2015 Camry SE</h1>');
  });

  it('should have Vehicle Highlights', () => {
    expect(wrapper.find('div.vehicle-highlights-list')).toBeTruthy();

    expect(wrapper.find('div.vehicle-highlights-list').children().length).toEqual(7);
    expect(wrapper.find('div.vehicle-highlights-list').childAt(0).find(VehicleHighlightItemComponent)).toBeTruthy();
    expect(wrapper.find('div.vehicle-highlights-list').childAt(0)
      .find(VehicleHighlightItemComponent).props().name).toEqual('6-Speed Automatic');

    expect(wrapper.find('div.vehicle-highlights-list').childAt(1).find(VehicleHighlightItemComponent)).toBeTruthy();
    expect(wrapper.find('div.vehicle-highlights-list').childAt(1)
      .find(VehicleHighlightItemComponent).props().name).toEqual('2.5L V4');

    expect(wrapper.find('div.vehicle-highlights-list').childAt(2).find(VehicleHighlightItemComponent)).toBeTruthy();
    expect(wrapper.find('div.vehicle-highlights-list').childAt(2)
      .find(VehicleHighlightItemComponent).props().name).toEqual('32 MPG');

    expect(wrapper.find('div.vehicle-highlights-list').childAt(3).find(VehicleHighlightItemComponent)).toBeTruthy();
    expect(wrapper.find('div.vehicle-highlights-list').childAt(3)
      .find(VehicleHighlightItemComponent).props().name).toEqual('Seats 5');
  });
});
