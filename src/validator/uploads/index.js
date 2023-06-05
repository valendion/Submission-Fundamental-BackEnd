const InvariantError = require('../../exeptions/InvariantError');
const { ImagesSchema } = require('./schema');

const UploadsValidator = {
  validateImages: (headers) => {
    const validationResult = ImagesSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
