import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import HomePage from '../../app/components/pages/HomePage';

configure({ adapter: new Adapter() });

describe('Home Page', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<HomePage />);
  });

  it('should exist', () => {
    expect(wrapper).toBeTruthy();
  });

  it('should have one div', () => {
    expect(wrapper.find('div').type()).toEqual('div');
  });
});
