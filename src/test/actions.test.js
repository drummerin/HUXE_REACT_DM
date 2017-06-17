import * as actions from '../actions';

describe('actions', () => {
  it('set project', () => {
    const project = 'set test';
    const expectedAction = {
      type: 'SET_PROJECT',
      payload: project,
    };
    expect(actions.setProject(project)).toEqual(expectedAction);
  });
});
