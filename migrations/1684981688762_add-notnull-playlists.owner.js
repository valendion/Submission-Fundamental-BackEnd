/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.alterColumn('playlists', 'owner', {
    type: 'VARCHAR(50)',
    notNull: true,
  });
};

exports.down = (pgm) => {
  pgm.alterColumn('playlists', 'owner', {
    type: 'VARCHAR(50)',
  });
};

