import sinon from 'sinon';
import { assert } from 'chai';
import SubBuffer from '../lib/sub-buffer';

describe('Sub Buffer', function () {

    let subBuffer;

    beforeEach(function () {
        subBuffer = new SubBuffer();
    });

    it('should have right settings', function () {
        assert.equal(subBuffer.records.length, 0);
        assert.equal(subBuffer.currentSize, 0);
    });

    it('should push onto records', function () {
        subBuffer.push('hello world');
        assert.deepEqual(subBuffer.records, ['hello world']);
    });

    it('should clear records', function () {
        subBuffer.push('hello world');
        assert.deepEqual(subBuffer.records, ['hello world']);

        subBuffer.clear();
        assert.equal(subBuffer.records.length, 0);
    });
});
