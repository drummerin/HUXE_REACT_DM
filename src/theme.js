import {
    grey100, grey900,
    fullWhite, fullBlack, darkBlack,
} from 'material-ui/styles/colors';
import { fade } from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import projects from './projects';

export function getTheme(projectName) {
  const project = projects.find(loopStation => loopStation.projectName === projectName);
  return getMuiTheme({
    spacing,
    fontFamily: 'Roboto, sans-serif',
    palette: {
      primary1Color: project.projectColor,
      primary2Color: project.projectColor,
      primary3Color: grey900,
      accent1Color: '#DF1C24',
      accent2Color: grey100,
      accent3Color: darkBlack,
      textColor: darkBlack,
      secondaryTextColor: (0, fade)(fullWhite, 0.7),
      alternateTextColor: fullWhite,
      canvasColor: fullWhite,
      clockCircleColor: (0, fade)(fullWhite, 0.12),
      shadowColor: fullBlack,
    },
    drawer: {
      width: 256,
    },
  });
}

export default getTheme('Meeting 1.6.2017');
