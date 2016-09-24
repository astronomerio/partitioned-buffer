import sinon from 'sinon';
import { assert } from 'chai';
import PartitionedBuffer from '../lib';
import SubBuffer from '../lib/sub-buffer';

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
            assert(flushBufferStub.calledWith(buffer.records, key));
        });
    });

    describe('#getBufferWithKey', function () {
        beforeEach(function () {
            pb = new PartitionedBuffer(() => {});
        });

        it('returns the correct buffer', function () {
            const expectedSubBuffer = new SubBuffer();
            expectedSubBuffer.push(data);

            pb.push(key, data);
            const buffer = pb.getBufferWithKey(key);

            // these are timestamps made when push() is called, sometimes they can be off by a millisecond and cause the test to fail, get rid of them :)
            delete expectedSubBuffer.lastFlushMillis;
            delete buffer.lastFlushMillis;
            assert.deepEqual(buffer, expectedSubBuffer);
        });
    });

   describe('#pushDataToBuffer', function () {
       it('should call push on the sub buffer', function () {
           const subBuffer = new SubBuffer();
           const stub = sinon.stub(subBuffer, 'push');

           pb.pushDataToBuffer(subBuffer, data);
           assert(stub.calledWith(data));
       });
   });

   describe('#bufferShouldFlush', function () {
       it('should return true when buffer length is greater than max', function () {
           // set the pb maxLength to be 1
           pb.maxRecordsPerFlush = 1;

           const subBuffer = new SubBuffer();

           // we'll push 2 objects, to be over the max
           subBuffer.push(data);
           subBuffer.push(data);

           const shouldFlush = pb.bufferShouldFlush(subBuffer);
           assert(shouldFlush);
       });

       it('should return false when buffer length is less than max', function () {
           // set the pb maxLength to be 3
           pb.maxRecordsPerFlush = 3;

           const subBuffer = new SubBuffer();

           // we'll push 2 objects, to still be under the max
           subBuffer.push(data);
           subBuffer.push(data);

           const shouldFlush = pb.bufferShouldFlush(subBuffer);
           assert.isFalse(shouldFlush);
       });
   });

   describe('#flushAllBuffers', function () {
       it('should call flush with all sub buffers', function (done) {
           const flushBufferStub = sinon.stub();
           const clearStub = sinon.stub();
           pb = new PartitionedBuffer(flushBufferStub);

           // push onto pb with different keys to make different sub buffers
           const key2 = 'key2';
           const data2 = 'hello world';

           pb.push(key, data);
           pb.push(key2, data2);

           // stub all the clear() on the sub buffers to make sure they're called
           Object.keys(pb.buffers).forEach(function(key, index) {
               const subBuffer = pb.buffers[key];
               subBuffer.clear = clearStub;
           });

           // flush all buffers is async, so it returns a promise
           pb.flushAllBuffers().then(() => {
               // make sure flushBuffer was called with the right data
               assert(flushBufferStub.firstCall.calledWith([data], key));
               assert(flushBufferStub.secondCall.calledWith([data2], key2));
               // make sure the buffers are being cleared
               assert.ok(clearStub.calledTwice);
               done();
           }).catch((e) => {
               done(e);
           });
       });
   });
});
