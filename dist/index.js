'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _subBuffer = require('./sub-buffer');

var _subBuffer2 = _interopRequireDefault(_subBuffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PartitionedBuffer = function () {
    function PartitionedBuffer(flushBuffer) {
        var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

        _classCallCheck(this, PartitionedBuffer);

        this.buffers = {};
        this.maxBytesPerFlush = options.maxBytesPerFlush || 500000;
        this.maxRecordsPerFlush = options.maxRecordsPerFlush || 500;
        this.maxMillisPerFlush = options.maxMillisPerFlush || 300000;
        this.flushBuffer = flushBuffer;
    }

    _createClass(PartitionedBuffer, [{
        key: 'push',
        value: function () {
            var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(key, data) {
                var buffer;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                // get internal buffer and push data
                                buffer = this.getBufferWithKey(key);

                                this.pushDataToBuffer(buffer, data);
                                // check should flush and emit data

                                if (!this.bufferShouldFlush(buffer)) {
                                    _context.next = 6;
                                    break;
                                }

                                _context.next = 5;
                                return this.flushBuffer(buffer.records, key);

                            case 5:
                                this.clearBuffer(buffer);

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function push(_x2, _x3) {
                return _ref.apply(this, arguments);
            }

            return push;
        }()
    }, {
        key: 'getBufferWithKey',
        value: function getBufferWithKey(key) {
            var buffer = this.buffers[key];
            if (buffer) {
                return buffer;
            }

            this.buffers[key] = new _subBuffer2.default();
            return this.buffers[key];
        }
    }, {
        key: 'pushDataToBuffer',
        value: function pushDataToBuffer(buffer, data) {
            buffer.push(data);
        }
    }, {
        key: 'clearBuffer',
        value: function clearBuffer(buffer) {
            buffer.clear();
        }
    }, {
        key: 'bufferShouldFlush',
        value: function bufferShouldFlush(buffer) {
            var overSizeLimit = buffer.currentSize >= this.maxBytesPerFlush;
            var overRecordLimit = buffer.records.length >= this.maxRecordsPerFlush;
            var timeSinceLastFlush = Date.now() - buffer.lastFlushMillis;
            var overTimeLimit = timeSinceLastFlush >= this.maxMillisPerFlush;
            var shouldFlush = overSizeLimit || overRecordLimit || overTimeLimit;
            return shouldFlush;
        }
    }, {
        key: 'flushAllBuffers',
        value: function () {
            var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
                var keys, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, key, buffer;

                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                keys = Object.keys(this.buffers);
                                _iteratorNormalCompletion = true;
                                _didIteratorError = false;
                                _iteratorError = undefined;
                                _context2.prev = 4;
                                _iterator = keys[Symbol.iterator]();

                            case 6:
                                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                    _context2.next = 15;
                                    break;
                                }

                                key = _step.value;

                                // get individual buffer and flush the records
                                buffer = this.buffers[key];
                                _context2.next = 11;
                                return this.flushBuffer(buffer.records, key);

                            case 11:
                                this.clearBuffer(buffer);

                            case 12:
                                _iteratorNormalCompletion = true;
                                _context2.next = 6;
                                break;

                            case 15:
                                _context2.next = 21;
                                break;

                            case 17:
                                _context2.prev = 17;
                                _context2.t0 = _context2['catch'](4);
                                _didIteratorError = true;
                                _iteratorError = _context2.t0;

                            case 21:
                                _context2.prev = 21;
                                _context2.prev = 22;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 24:
                                _context2.prev = 24;

                                if (!_didIteratorError) {
                                    _context2.next = 27;
                                    break;
                                }

                                throw _iteratorError;

                            case 27:
                                return _context2.finish(24);

                            case 28:
                                return _context2.finish(21);

                            case 29:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[4, 17, 21, 29], [22,, 24, 28]]);
            }));

            function flushAllBuffers() {
                return _ref2.apply(this, arguments);
            }

            return flushAllBuffers;
        }()
    }]);

    return PartitionedBuffer;
}();

exports.default = PartitionedBuffer;
;