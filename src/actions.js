export function setProject(project) {
  return {
    type: 'SET_PROJECT',
    payload: project,
  };
}
export function addProject(project) {
  return {
    type: 'ADD_PROJECT',
    payload: project,
  };
}
export function deleteProject(project) {
  return {
    type: 'DELETE_PROJECT',
    payload: project,
  };
}

export function changeSettings(update) {
  return {
    type: 'CHANGE_SETTINGS',
    payload: update,
  };
}
export function updateProgram(station) {
  const url = `https://audioapi.orf.at/${station.shortName}/api/json/current/live`;
  return {
    type: 'UPDATE_PROGRAM',
    payload: fetch(url)
            .then(response => response.json())
            .then((data) => {
              const now = Date.now();
              const songs = [];
              let currentBroadcast = '';
              data.forEach((broadcast) => {
                if (broadcast.start < now && broadcast.end > now) {
                  currentBroadcast = broadcast.title;
                }
                broadcast.items.forEach((item) => {
                  if (item.type === 'M') {
                    songs.push({
                      start: item.start,
                      artist: item.interpreter,
                      song: item.title,
                      time: new Date(item.start),
                      key: item.id,
                    });
                  }
                });
              });
              songs.sort((a, b) => b.start - a.start);
              return {
                songs,
                broadcast: currentBroadcast,
              };
            }),
  };
}
