/*jslint node: true */
"use strict";

var net = require('net');
var util = require('util');
var requestParser = require('./http_request_parser.js');
var ResponseBuilder = require('./http_response_builder.js');

var STATUS_CODES = ResponseBuilder.STATUS_CODES;

exports.STATUS_CODES = STATUS_CODES;

util.inherits(Server, net.Server);
function Server(connectionListener) {
    Server.super_.call(this,
        function(client) {
            requestParser(client, function(request) {
                var response = new ResponseBuilder();
                response.pipe(client);
                connectionListener(request, response);
            });
        });
}

exports.Server = Server;

exports.createServer = function(connectionListener) {
  return new Server(connectionListener);
};
