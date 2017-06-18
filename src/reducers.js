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
      let projectIndex;
      if (action.payload.projectName !== undefined) {
        for (let i = 0; i < projects.length; i += 1) {
          if (projects[i].projectName === action.payload.projectName) {
            projectIndex = i;
            break;
          }
        }
      }
      let themeX;
      if (action.payload !== undefined) {
        themeX = defaultTheme;// getTheme(projects[projectIndex].projectName);
      } else {
        themeX = defaultTheme;
      }
      console.log('.x.');
      return {
        ...state,
        project: {
          ...projects[projectIndex],
        },
        theme: themeX,
      };
    }
    default: {
      return state;
    }
  }
}
