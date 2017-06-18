import React from 'react';
import { mount } from 'enzyme';
import ProjectHeaderRight from '../components/ProjectHeaderRight';

test('Project Header Test', () => {
  const component = mount(
        <ProjectHeaderRight project={{ projectName: 'project name', projectAuthor: 'Sophie', projectDate: '3 June 2017 Summer' }}
                            user='UserTest'/>,
    );

  expect(component.text().includes('project name')).toBe(true);
  expect(component.text().includes('Sophie')).toBe(true);
  expect(component.text().includes('3 June 2017')).toBe(true);
  expect(component.text().includes('UserTest')).toBe(true);
});
