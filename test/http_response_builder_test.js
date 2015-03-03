/*jslint node: true */
/*jshint -W069 */
/*global describe, it */

var assert = require('assert');
var Writable = require('stream').Writable;
var util = require('util');
var ResponseBuilder = require('../http_response_builder.js');

describe("ResponseBuilder", function() {
    it("It should produce a correct response", function(done) {
        var responseBuilder = new ResponseBuilder(),
            outStream = new StringWritable();

        responseBuilder.headers["Content-Length"] = "5";
        responseBuilder.write("Hello");
        responseBuilder.end();

        responseBuilder.pipe(outStream);
        outStream.on('finish', function() {
            var actual = outStream.toString();
            var expected =
                'HTTP/1.1 200 OK\r\n' +
                'Content-Length: 5\r\n' +
                '\r\n' +
                'Hello';
            assert.equal(actual, expected);
            done();
        });

    });
});

util.inherits(StringWritable, Writable);
function StringWritable(options) {
    this._rawData = [];
    StringWritable.super_.call(this, options);
}

StringWritable.prototype._write = function(chunk, encoding, done) {
    this._rawData.push(chunk);
    done();
};

StringWritable.prototype.toString = function() {
    return Buffer.concat(this._rawData).toString();
};
