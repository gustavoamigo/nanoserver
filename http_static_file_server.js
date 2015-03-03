/*jslint node: true */
"use strict";

var util = require('util');
var httpServer = require('./http_server.js');
var fs = require('fs');

var debug = console.error;
var DEFAULT_MIME_TYPES =
    {
        '.html':'text/html',
        '.css':'text/css',
        '.png':'image/png',
        '.jpg':'image/jpg',
        '.js':'application/javascript'
    };

var DEFAULT_FILE = 'index.html';

util.inherits(Server, httpServer.Server);
function Server(options) {
    options = options || {};
    this.rootPath = options.rootPath || '.';
    console.log("rootPath "  + this.rootPath);
    this.mimeTypes = options.mimeTypes || DEFAULT_MIME_TYPES;
    Server.super_.call(this, (this._requestListener).bind(this));
}

Server.prototype._requestListener = function(request, response) {
    var _this = this;

    var lastCharacter = request.path.slice(-1);
    var path =
        lastCharacter === '/' ? request.path + DEFAULT_FILE : request.path;
    var file = this.rootPath + path;
    var extension = this._extractFileExtension(path);

    if(request.method !== 'GET') {
        debug('Method "' + request.method + '" not supported');
        this._badRequest(response);
        return;
    }

    debug('Serving file: ' + file);

    if(this.mimeTypes[extension] === undefined) {
        debug('Mime type for ' + extension + ' not found');
        this._notFound(response);
        return;
    }

    fs.stat(file, function(err, stats) {
        if(err) {
            debug('File not found ' + err);
            _this._notFound(response);
            return;
        }
        response.headers['Content-Type'] = _this.mimeTypes[extension];
        response.headers['Content-Length'] = stats.size;
        var readStream = fs.createReadStream(file);
        readStream.pipe(response);
    });
};

Server.prototype._notFound = function(response) {
    response.setStatusCode(404);
    response.end('');
};

Server.prototype._badRequest = function(response) {
    response.setStatusCode(400);
    response.end('');
};

Server.prototype._extractFileExtension = function(file) {
    var splitParts = file.split('.');
    return '.' + splitParts[splitParts.length - 1];
};

exports.createServer = function(options) {
  return new Server(options);
};
