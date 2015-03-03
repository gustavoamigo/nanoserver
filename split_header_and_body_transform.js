/*jslint node: true */
"use strict";

var util = require('util');
var Transform = require('stream').Transform;

var regionEnum = {HEADER:0, BODY:1};

util.inherits(SplitHeaderAndBodyTransform, Transform);

function SplitHeaderAndBodyTransform(options) {
    this._lastByteRead = 0;
    this._currentRegion = regionEnum.HEADER;
    this._rawHeader = [];
    this._lastFourBytes = [0,0,0,0];
    SplitHeaderAndBodyTransform.super_.call(this, options);
}


SplitHeaderAndBodyTransform.prototype._transform = function(chunk, encoding, done) {
    switch (this._currentRegion) {
        case regionEnum.HEADER:
            for (var i = 0; i < chunk.length; i++) {
                this._lastFourBytes.push(chunk[i]);
                this._lastFourBytes.shift();

                var isCRLFCRLF = this._lastFourBytes[0] === 13
                    && this._lastFourBytes[1] === 10
                    && this._lastFourBytes[2] === 13
                    && this._lastFourBytes[3] === 10;

                if( isCRLFCRLF ) {
                    this._currentRegion = regionEnum.BODY;
                    this._rawHeader.push(chunk.slice(0,i-1));
                    var header = Buffer.concat(this._rawHeader).toString();
                    this.emit('header', header);
                    this.push(chunk.slice(i+1));
                    break;
                }
            }
            if(this._currentRegion === regionEnum.HEADER) {
                this._rawHeader.push(chunk);
            }
            break;
        case regionEnum.BODY:
            this.push(chunk);
            break;
    }
    done();
};

module.exports = SplitHeaderAndBodyTransform;
