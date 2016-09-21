import sinon from 'sinon';
import assert from 'assert';
import PartitionedBuffer from '../lib';

describe('Partitioned Buffer', function () {
    var pb;
    const key = 'my_key';
    const data = ['foo, bar'];

    it('should have correct settings', function () {
        const flushBufferStub = sinon.stub();
        pb = new PartitionedBuffer(flushBufferStub);
        assert.equal(flushBufferStub, pb.flushBuffer);
    });

    describe('#push', function () {
        var flushBufferStub;

        beforeEach(function () {
            flushBufferStub = sinon.stub();
            pb = new PartitionedBuffer(flushBufferStub);
        });

        it('calls getBufferWithKey', function () {
            const stub = sinon.stub(pb, 'getBufferWithKey');
            pb.push(key, data);
            assert(stub.calledWith(key));
        });

        it('calls pushDataToBuffer', function () {
            const stub = sinon.stub(pb, 'pushDataToBuffer');
            pb.push(key, data);
            const buffer = pb.getBufferWithKey(key);
            assert(stub.calledWith(buffer, data));
        });

        it('calls bufferShouldFlush', function () {
            const stub = sinon.stub(pb, 'bufferShouldFlush');
            pb.push(key, data);
            const buffer = pb.getBufferWithKey(key);
            assert(stub.calledWith(buffer));
        });

        it('calls flushBuffer', function () {
            sinon.stub(pb, 'bufferShouldFlush').returns(true);
            pb.push(key, data);
            const buffer = pb.getBufferWithKey(key);
            assert(flushBufferStub.calledWith(buffer, key));
        });
    });
});
