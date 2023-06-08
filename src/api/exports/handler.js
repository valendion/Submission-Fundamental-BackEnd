const autoBind = require('auto-bind');

class ExportsHandler {
  constructor(producerService, playlistsService, validator) {
    this._producerService = producerService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    autoBind(this);
  }

  async postExportPlaylistsHandler(request, h) {
    this._validator.validateExportPlaylistPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { id } = request.params;

    await this._playlistsService.verifyPlaylistAccess(id, credentialId);
    await this._playlistsService.getPlaylistsById(id);

    const message = {
      userId: id,
      targetEmail: request.payload.targetEmail,
    };
    console.log(message);
    await this._producerService.sendMessage(
      'export:playlists',
      JSON.stringify(message)
    );

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportsHandler;
