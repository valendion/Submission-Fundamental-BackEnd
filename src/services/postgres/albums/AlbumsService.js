const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const { mapDBToModelAlbum } = require('../../../utils');
const NotFoundError = require('../../../exeptions/NotFoundError');
const InvariantError = require('../../../exeptions/InvariantError');

class AlbumsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async addAlbum({ name, year, cover = null }) {
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO albums VALUES($1,$2,$3,$4,$5,$6) RETURNING id',
      values: [id, name, year, createdAt, updatedAt, cover],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getAlbums() {
    const result = await this._pool.query('SELECT * FROM albums');
    return result.rows.map(mapDBToModelAlbum);
  }

  async getAlbumById(id) {
    const queryAlbum = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };
    const querySong = {
      text: `SELECT songs.id, songs.title, songs.performer FROM songs
      INNER JOIN albums ON albums.id=songs."albumid"
      WHERE albums.id=$1`,
      values: [id],
    };

    const resultAlbum = await this._pool.query(queryAlbum);
    const resultSong = await this._pool.query(querySong);

    if (!resultAlbum.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return {
      id: resultAlbum.rows[0].id,
      name: resultAlbum.rows[0].name,
      year: resultAlbum.rows[0].year,
      coverUrl: resultAlbum.rows[0].cover,
      songs: resultSong.rows,
    };
  }

  async editAlbumById(id, { name, year, cover = null }) {
    const updateAt = new Date().toISOString();

    const query = {
      text: 'UPDATE albums SET name = $1, year = $2,update_at = $3, cover=$4 WHERE id = $4 RETURNING id',
      values: [name, year, updateAt, cover, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan');
    }
  }

  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }
  }

  async editCoverById(id, cover) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [cover, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError(
        'Gagal memperbarui cover Album. id tidak ditemukan'
      );
    }
  }

  async addAlbumLike(albumId, userId) {
    await this.getAlbumById(albumId);
    await this.verifyUserLikeAlbum(albumId, userId);

    const id = `albumlike-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO album_likes VALUES($1, $2,$3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('gagal menyukai album');
    }

    await this._cacheService.delete(`album_likes:${albumId}`);
    return result.rows[0].id;
  }

  async deleteAlbumLike(albumId, userId) {
    const query = {
      text: 'DELETE FROM album_likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new NotFoundError('gagal menghapus menyukai album');
    }

    await this._cacheService.delete(`album_likes:${albumId}`);
  }

  async getAlbumLikeById(albumId) {
    try {
      const result = await this._cacheService.get(`album_likes:${albumId}`);
      return {
        parseResult: JSON.parse(result),
        isCache: true,
      };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(*) FROM album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);
      const parseResult = parseInt(result.rows[0].count, 10);

      await this._cacheService.set(`album_likes:${albumId}`, parseResult);
      return { parseResult, iscache: false };
    }
  }

  async verifyUserLikeAlbum(albumId, userId) {
    const query = {
      text: 'SELECT * FROM album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError(
        'Gagal menyukai album. User sudah menyukai album'
      );
    }
  }

  async verifyUserLikeAlbum(albumId, userId) {
    const query = {
      text: 'SELECT * FROM album_likes WHERE album_id = $1 AND user_id = $2',
      values: [albumId, userId],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError(
        'Gagal menyukai album. User sudah menyukai album'
      );
    }
  }
}
module.exports = AlbumsService;
