import projects from './projects';
import defaultTheme, { getTheme } from './theme';


export default function reducer(state = {
  project: { ...projects[0] },
  theme: defaultTheme,
  /* settings: {
    dark: true,
  },
  program: {
    data: null,
    songs: [],
    broadcast: '',
    fetching: false,
    error: null,
  },*/
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
    case 'ADD_PROJECT': {
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
    case 'DELETE_PROJECT': {
      return {
        ...state,
        project: {
          ...action.payload,
        },
        theme: getTheme(action.payload.projectName),
      };
    }
    case 'CHANGE_SETTINGS': {
      const settings = {
        ...state.settings,
        ...action.payload,
      };
      return {
        ...state,
        theme: getTheme(state.project.projectName),
        settings,
      };
    }
    case 'UPDATE_PROGRAM_PENDING': {
      return {
        ...state,
        program: {
          songs: [],
          broadcast: '',
          fetching: true,
          error: null,
        },
      };
    }
    case 'UPDATE_PROGRAM_FULFILLED': {
      return {
        ...state,
        program: {
          songs: action.payload.songs,
          broadcast: action.payload.broadcast,
          fetching: false,
          error: null,
        },
      };
    }
    case 'UPDATE_PROGRAM_REJECTED': {
      return {
        ...state,
        program: {
          songs: [],
          broadcast: '',
          fetching: false,
          error: action.payload.message,
        },
      };
    }
    default: {
      return state;
    }
  }
}
