"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SubBuffer = function () {
    function SubBuffer() {
        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, SubBuffer);

        this.records = [];
        this.currentSize = 0;
        this.lastFlushMillis = Date.now();
    }

    _createClass(SubBuffer, [{
        key: "push",
        value: function push(data) {
            // TODO: add some checks for types of data to get the number of bytes so we can compare against maxByteSize
            this.records.push(data);
        }
    }, {
        key: "clear",
        value: function clear() {
            this.records = [];
            this.currentSize = 0;
            this.lastFlushMillis = Date.now();
        }
    }]);

    return SubBuffer;
}();

exports.default = SubBuffer;
;