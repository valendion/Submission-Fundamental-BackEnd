/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.createTable('album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    user_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
  });

  pgm.addConstraint(
    'album_likes',
    'fk_user_id.users_id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
  );
  pgm.addConstraint(
    'album_likes',
    'fk_album_id.albums.id',
    'FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE'
  );

  pgm.addConstraint(
    'album_likes',
    'unique_album_id_and_user_id',
    'UNIQUE(album_id, user_id)'
  );
};

exports.down = (pgm) => {
  pgm.dropTable('album_likes');
};

