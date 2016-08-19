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
    function PartitionedBuffer(delegate) {
        _classCallCheck(this, PartitionedBuffer);

        this.buffers = {};
        this.delegate = delegate;
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
                                if (!this.buffers[key]) {
                                    this.buffers[key] = new _subBuffer2.default();
                                }

                                buffer = this.buffers[key];

                                buffer.push(data);

                                // check should flush and emit data

                                if (!buffer.shouldFlush()) {
                                    _context.next = 6;
                                    break;
                                }

                                _context.next = 6;
                                return this.delegate.bufferShouldFlush(buffer, key);

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));

            function push(_x, _x2) {
                return _ref.apply(this, arguments);
            }

            return push;
        }()
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
                                    _context2.next = 14;
                                    break;
                                }

                                key = _step.value;

                                // get individual buffer
                                buffer = this.buffers[key];

                                // emit records

                                _context2.next = 11;
                                return this.delegate.bufferShouldFlush(buffer, key);

                            case 11:
                                _iteratorNormalCompletion = true;
                                _context2.next = 6;
                                break;

                            case 14:
                                _context2.next = 20;
                                break;

                            case 16:
                                _context2.prev = 16;
                                _context2.t0 = _context2['catch'](4);
                                _didIteratorError = true;
                                _iteratorError = _context2.t0;

                            case 20:
                                _context2.prev = 20;
                                _context2.prev = 21;

                                if (!_iteratorNormalCompletion && _iterator.return) {
                                    _iterator.return();
                                }

                            case 23:
                                _context2.prev = 23;

                                if (!_didIteratorError) {
                                    _context2.next = 26;
                                    break;
                                }

                                throw _iteratorError;

                            case 26:
                                return _context2.finish(23);

                            case 27:
                                return _context2.finish(20);

                            case 28:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this, [[4, 16, 20, 28], [21,, 23, 27]]);
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