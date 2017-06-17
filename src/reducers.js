import projects from './projects';
import defaultTheme, { getTheme } from './theme';


export default function reducer(state = {
  project: { ...projects[0] },
  theme: defaultTheme,
}, action) {
  switch (action.type) {
    case 'SET_PROJECT': {
      return {
        ...state,
        project: {
          ...action.payload,
        },
        theme: getTheme(action.payload.projectName),
      };
    }
    case 'UPDATE_PROJECT': {
      console.log(action.payload);
      let projectIndex;
      for (let i = 0; i < projects.length; i += 1) {
        if (projects[i].projectName === action.payload.projectName) {
          projectIndex = i;
          console.log(projectIndex);
          break;
        }
      }
      return {
        ...state,
        project: {
          ...projects[projectIndex],
        },
        theme: getTheme(action.payload.projectName),
      };
    }
    default: {
      return state;
    }
  }
}
