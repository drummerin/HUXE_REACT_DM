export function setProject(project) {
  return {
    type: 'SET_PROJECT',
    payload: project,
  };
}
export function updateProject(project) {
  return {
    type: 'UPDATE_PROJECT',
    payload: project,
  };
}
