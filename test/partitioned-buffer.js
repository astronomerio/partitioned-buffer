const PartitionedBuffer = require('../lib');
const sinon = require('sinon');
const { assert } = require('chai');
const SubBuffer = require('../lib/sub-buffer');

describe('Partitioned Buffer', () => {
  let pb;
  const key = 'my_key';
  const data = ['foo, bar'];

  it('should have correct settings', () => {
    const flushBufferStub = sinon.stub();
    pb = new PartitionedBuffer(flushBufferStub);
    assert.equal(pb.maxBytesPerFlush, 500000);
    assert.equal(pb.maxMillisPerFlush, 30000);
    assert.equal(pb.maxRecordsPerFlush, 1000);
    assert.equal(flushBufferStub, pb.flushBuffer);
  });

  describe('#push', () => {
    let flushBufferStub;

    beforeEach(() => {
      flushBufferStub = sinon.stub();
      pb = new PartitionedBuffer(flushBufferStub);
    });

    it('calls getSubBufferWithKey', async () => {
      const spy = sinon.spy(pb, 'getSubBufferWithKey');
      await pb.push(key, data);
      assert(spy.calledWith(key));
    });

    it('calls push on sub buffer', async () => {
      const subBuffer = new SubBuffer();
      const subStub = sinon.stub(subBuffer, 'push');
      const stub = sinon.stub(pb, 'getSubBufferWithKey').returns(subBuffer);
      await pb.push(key, data);
      assert(stub.calledWith(key));
      assert(subStub.calledWith(data));
    });

    it('calls bufferShouldFlush', async () => {
      const stub = sinon.stub(pb, 'bufferShouldFlush');
      await pb.push(key, data);
      const buffer = pb.getSubBufferWithKey(key);
      assert(stub.calledWith(buffer));
    });

    it('calls flushBuffer and clear buffer', async () => {
      const subBuffer = new SubBuffer();
      sinon.stub(pb, 'getSubBufferWithKey').returns(subBuffer);
      sinon.stub(pb, 'bufferShouldFlush').returns(true);
      const clearStub = sinon.stub(subBuffer, 'clear');
      await pb.push(key, data);
      assert(flushBufferStub.calledWith(subBuffer.records, key));
      assert.ok(clearStub.calledOnce);
    });
  });

  describe('#getSubBufferWithKey', () => {
    beforeEach(() => {
      pb = new PartitionedBuffer(() => { });
    });

    it('returns the correct buffer', () => {
      const expectedSubBuffer = new SubBuffer();
      expectedSubBuffer.push(data);

      pb.push(key, data);
      const buffer = pb.getSubBufferWithKey(key);

      // these are timestamps made when push() is called, sometimes they can be off by a millisecond and cause the test to fail, get rid of them :)
      delete expectedSubBuffer.lastFlushMillis;
      delete buffer.lastFlushMillis;
      assert.deepEqual(buffer, expectedSubBuffer);
    });
  });

  describe('#bufferShouldFlush', () => {
    beforeEach(() => {
      pb = new PartitionedBuffer(() => { });
    });

    it('should return true when buffer length is greater than max', () => {
      // set the pb maxLength to be 2
      pb.maxRecordsPerFlush = 2;

      const subBuffer = new SubBuffer();

      // we'll push 2 objects, to hit the max
      subBuffer.push(data);
      // should be false after first one
      assert.notOk(pb.bufferShouldFlush(subBuffer));

      // once at 2, should be true
      subBuffer.push(data);
      assert(pb.bufferShouldFlush(subBuffer));
    });

    it('should return false when buffer length is less than max', () => {
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

  describe('#flushAllBuffers', async () => {
    beforeEach(() => {
      pb = new PartitionedBuffer(() => { });
    });

    it('should call flush with all sub buffers', async () => {
      const flushBufferStub = sinon.stub();
      const clearStub = sinon.stub();
      pb = new PartitionedBuffer(flushBufferStub);

      // push onto pb with different keys to make different sub buffers
      const key2 = 'key2';
      const data2 = 'hello world';

      pb.push(key, data);
      pb.push(key2, data2);

      // stub all the clear() on the sub buffers to make sure they're called
      Object.keys(pb.buffers).forEach((k) => {
        const subBuffer = pb.buffers[k];
        subBuffer.clear = clearStub;
      });

      // flush all buffers is async, so it returns a promise
      await pb.flushAllBuffers();
      // make sure flushBuffer was called with the right data
      assert(flushBufferStub.firstCall.calledWith([data], key));
      assert(flushBufferStub.secondCall.calledWith([data2], key2));
      // make sure the buffers are being cleared
      assert.ok(clearStub.calledTwice);
    });
  });
});
