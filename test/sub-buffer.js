const { assert } = require('chai');
const SubBuffer = require('../lib/sub-buffer');

describe('Sub Buffer', () => {
  let subBuffer;

  beforeEach(() => {
    subBuffer = new SubBuffer();
  });

  it('should have right settings', () => {
    assert.equal(subBuffer.records.length, 0);
    assert.equal(subBuffer.currentSize(), 0);
  });

  it('should push onto records', () => {
    subBuffer.push({ hello: 'world' });
    assert.deepEqual(subBuffer.records, [{ hello: 'world' }]);
  });

  it('should clear records', () => {
    subBuffer.push('hello world');
    assert.deepEqual(subBuffer.records, ['hello world']);

    subBuffer.clear();
    assert.equal(subBuffer.records.length, 0);
  });
});
