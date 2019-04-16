import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ZipCodeModal from '../../app/components/modal/ZipCodeModal';

configure({ adapter: new Adapter() });

describe('Zip Code Modal Component', () => {
  let wrapper;
  let props;

  beforeEach(() => {
    props = {
        showModal: true,
        addZipCodeData: jest.fn()
      };
    wrapper = shallow(<ZipCodeModal {...props} />);
  });

  it('should exist', () => {
    expect(wrapper).toBeTruthy();
  });
 
  it('should have one Modal', () => {
    expect(wrapper.find('Modal').length).toEqual(1);
  });

  it('simulates click events', () => {
    wrapper.find('button').simulate('click');
    expect(props.addZipCodeData).toHaveBeenCalled();
  });
  
});