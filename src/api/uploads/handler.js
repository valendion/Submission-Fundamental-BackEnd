const autoBind = require('auto-bind');
class UploadsHandler {
  constructor(storageService, albumsService, validator) {
    this._storageService = storageService;
    this._albumsService = albumsService;
    this._validator = validator;

    autoBind(this);
  }

  async postUploadImagehandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    this._validator.validateImages(cover.hapi.headers);

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
    await this._albumsService.editCoverById(id, fileLocation);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil di unggah',
      data: {
        fileLocation,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
