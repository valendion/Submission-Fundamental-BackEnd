const routes = (handler) => [
  {
    method: 'POST',
    path: '/playlists',
    handler: handler.postPlaylistHandler,
    options: {
      auth: 'submission_back_end_jwt',
    },
  },

  {
    method: 'GET',
    path: '/playlists',
    handler: handler.getPlaylistHandler,
    options: {
      auth: 'submission_back_end_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: handler.deletePlaylistHandler,
    options: {
      auth: 'submission_back_end_jwt',
    },
  },

  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: handler.postSongToPlaylistHandler,
    options: {
      auth: 'submission_back_end_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: handler.getSongFromPlaylistHandler,
    options: {
      auth: 'submission_back_end_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: handler.deleteSongFromPlaylistHandler,
    options: {
      auth: 'submission_back_end_jwt',
    },
  },
];

module.exports = routes;
