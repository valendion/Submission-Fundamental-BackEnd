const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModelSongs } = require('../../../utils');
const NotFoundError = require('../../../exeptions/NotFoundError');
const InvariantError = require('../../../exeptions/InvariantError');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({ title, year, genre, performer, duration, albumId }) {
    const id = nanoid(16);
    const createAt = new Date().toISOString();
    const updateAt = createAt;

    const query = {
      text: 'INSERT INTO songs VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING id',
      values: [
        id,
        title,
        year,
        genre,
        performer,
        duration,
        albumId,
        createAt,
        updateAt,
      ],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getSongs() {
    const result = await this._pool.query(
      'SELECT id,title,performer FROM songs'
    );
    return result.rows.map(mapDBToModelSongs);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }
    return result.rows.map(mapDBToModelSongs)[0];
  }

  async editSongById(id, { title, year, genre, performer, duration, albumId }) {
    const updateAt = new Date().toISOString();

    const query = {
      text: 'UPDATE songs SET title = $1, year = $2,genre =$3,performer=$4,duration=$5,albumId=$6 ,update_at = $7 WHERE id = $8 RETURNING id',
      values: [title, year, genre, performer, duration, albumId, updateAt, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}
module.exports = SongsService;
