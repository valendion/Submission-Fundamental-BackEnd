const InvariantError = require('../../exeptions/InvariantError');
const { AlbumPayloadSchema } = require('./scheme');
const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult);
    }
  },
};
module.exports = AlbumsValidator;
