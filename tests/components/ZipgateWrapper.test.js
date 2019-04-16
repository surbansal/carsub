import React from 'react';
import { mount, shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ZipgateWrapper from '../../app/components/ZipgateWrapper';
import ZipCodeModal from '../../app/components/modal/ZipCodeModal';

configure({ adapter: new Adapter() });

describe('Zipgate Wrapper Component', () => {
  let wrapper;
  let props;
  let childProps;
  let childWrapper;

  const checkZipForTrue = jest.fn(()=>{
    const existingZipCode = true;
    const showModal = false;
    return showModal;
  } );
  
  const checkZipForFalse = jest.fn(()=>{
    const existingZipCode = false;
    const showModal = true;
    return showModal;
  } );

  beforeEach(() => {
    props = {
      children: <div></div>
    };
    childProps = {
      showModal:false,
      addZipCodeData:jest.fn(()=> {
        childProps.showModal = false;
        childWrapper.setProps(childProps);
      })
    }
    wrapper = mount(<ZipgateWrapper {...props} />);
  });

  it('should exist', () => {
    expect(wrapper).toBeTruthy();
  });
 
  it('should have one ZipCodeModal', () => {
    expect(wrapper.find('ZipCodeModal').length).toEqual(1);
  });

  it('should have one ZipCodeModal', () => {
    expect(wrapper.find('ZipCodeModal').length).toEqual(1);
  });

  it('should have ZipCodeModal hidden if Zip Code is already present', () => {
    childProps.showModal= checkZipForTrue();
    childWrapper = mount(<ZipCodeModal {...childProps} />);
    expect(childWrapper.find('Modal').prop('isOpen')).toEqual(false);
  });

  it('should have ZipCodeModal shown if Zip Code is not present', () => {
    childProps.showModal= checkZipForFalse();
    childWrapper = mount(<ZipCodeModal {...childProps} />);
    expect(childWrapper.find('button').length).toEqual(1);
    expect(childWrapper.find('Modal').prop('isOpen')).toEqual(true);
  });

  it('should close modal when button is clicked and ZipCode get stored', () => {
    childProps.showModal= checkZipForFalse();
    childWrapper = mount(<ZipCodeModal {...childProps} />);
    expect(childWrapper.find('button').length).toEqual(1);
    childWrapper.find('button').simulate('click');
    expect(childWrapper.find('Modal').prop('isOpen')).toEqual(false);
  });
});