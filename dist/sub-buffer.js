'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SubBuffer = function () {
    function SubBuffer() {
        _classCallCheck(this, SubBuffer);

        this.records = [];
        this.currentSize = 0;
        this.lastFlushMillis = Date.now();
        this.maxBytesPerFlush = 500000;
        this.maxRecordsPerFlush = 500;
        this.maxMillisPerFlush = 300000;
    }

    _createClass(SubBuffer, [{
        key: 'shouldFlush',
        value: function shouldFlush() {
            var overSizeLimit = this.currentSize >= this.maxBytesPerFlush;
            var overRecordLimit = this.records.length >= this.maxRecordsPerFlush;

            var timeSinceLastFlush = Date.now() - this.lastFlushMillis;
            var overTimeLimit = timeSinceLastFlush >= this.maxMillisPerFlush;

            var flush = overSizeLimit || overRecordLimit || overTimeLimit;

            return flush;
        }
    }, {
        key: 'push',
        value: function push(data) {
            var string = new Buffer(data, 'base64').toString('utf8');
            this.currentSize += string.length;
            var recordData = JSON.parse(string);

            var payload = recordData.data;

            this.records.push(payload);
        }
    }, {
        key: 'clear',
        value: function clear() {
            this.records = [];
            this.currentSize = 0;
            this.lastFlushMillis = Date.now();
        }
    }]);

    return SubBuffer;
}();

exports.default = SubBuffer;