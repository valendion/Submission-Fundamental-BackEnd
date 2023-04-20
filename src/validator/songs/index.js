const InvariantError = require('../../exeptions/InvariantError');
const { SongPayloadSchema } = require('./scheme');
const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = SongPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult);
    }
  },
};
module.exports = SongsValidator;
