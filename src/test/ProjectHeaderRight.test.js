import React from 'react';
import { mount } from 'enzyme';
import ProjectHeaderRight from '../components/ProjectHeaderRight';

test('Project Header Test', () => {
  const component = mount(
        <ProjectHeaderRight project='project name'/>,
    );

  expect(component.text().includes('project name')).toBe(true);
});
