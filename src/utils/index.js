const mapDBToModelAlbum = ({
  id,
  name,
  year,
  create_at,
  update_at,
  cover,
}) => ({
  id,
  name,
  year,
  createAt: create_at,
  updateAt: update_at,
  cover,
});

const mapDBToModelSongs = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  create_at,
  update_at,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId,
  createAt: create_at,
  updateAt: update_at,
});

module.exports = { mapDBToModelAlbum, mapDBToModelSongs };
