/* eslint-disable camelcase */

exports.up = (pgm) => {
  pgm.alterColumn('songs', 'albumid', {
    type: 'VARCHAR(50)',
  });
};

exports.down = (pgm) => {
  pgm.alterColumn('songs', 'albumid', {
    type: 'INTENGER',
  });
};

