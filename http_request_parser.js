/*jslint node: true */
"use strict";
var SplitHeaderAndBodyTransform = require('./split_header_and_body_transform.js');

var CRLF = "\r\n";

function requestParser(inputStream, callback) {
    var splitHeaderAndBody = new SplitHeaderAndBodyTransform();

    splitHeaderAndBody.on('header', function(header) {
        var lines = header.split(CRLF),
            requestLine = parseRequestLine(lines[0]),
            request = {};

        request.body = splitHeaderAndBody;
        request.method = requestLine.method;
        request.requestTarget = requestLine.requestTarget;

        var requestTargetParts = request.requestTarget.split('?');
        request.path = requestTargetParts[0];
        request.query =
            requestTargetParts.length > 1 ? requestTargetParts[1] : null;

        request.httpVersion = requestLine.httpVersion;
        request.headers = parseHeaderFields(lines);

        callback(request);
    });

    inputStream.pipe(splitHeaderAndBody);
}

function parseRequestLine(line) {
    var tokens = line.split(" "),
        requestLine = {};
    requestLine.method = tokens[0];
    requestLine.requestTarget = tokens[1];
    requestLine.httpVersion = tokens[2];
    return requestLine;
}

function parseHeaderFields(lines) {
    var headers = [];
    for(var i = 1; i < lines.length; i ++) {
        var tokens = lines[i].split(": ");
        headers[tokens[0]] = tokens[1];
    }
    return headers;
}

module.exports = requestParser;
