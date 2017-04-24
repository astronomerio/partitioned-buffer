const SubBuffer = require('./sub-buffer');
const assert = require('assert');

class PartitionedBuffer {
  constructor(flushBuffer, options = {}) {
    assert(flushBuffer, 'Must provide a flush buffer function.');
    this.buffers = {};
    this.maxBytesPerFlush = options.maxBytesPerFlush || 500000; // 0.5 mb
    this.maxRecordsPerFlush = options.maxRecordsPerFlush || 1000;
    this.maxMillisPerFlush = options.maxMillisPerFlush || 30000; // 30 seconds
    this.flushBuffer = flushBuffer;
  }

  /**
   * Pushes data onto a sub buffer. Will automatically flush the sub buffer if it reaches the threshold.
   * @param {String} key Key at which the sub buffer which holds the data is stored.
   * @param {Object} data Data to add to the sub buffer
   */

  async push(key, data) {
    const subBuffer = this.getSubBufferWithKey(key);
    subBuffer.push(data);
    // check should flush and emit data
    if (this.bufferShouldFlush(subBuffer)) {
      await this.flushBuffer(subBuffer.records, key);
      subBuffer.clear();
    }
  }

  /**
   * Returns the buffer stored at key, or creates and returns a new one stored at key.
   * @param {String} key Key value at which the buffer is stored
   * @returns {SubBuffer} sub buffer stored at the key
   */

  getSubBufferWithKey(key) {
    const buffer = this.buffers[key];
    if (buffer) {
      return buffer;
    }

    this.buffers[key] = new SubBuffer();
    return this.buffers[key];
  }

  /**
   * Returns the buffer stored at key, or creates and returns a new one stored at key.
   * @param {String} key Key value at which the buffer is stored
   * @returns {SubBuffer} sub buffer stored at the key
   */

  bufferShouldFlush(buffer) {
    const overSizeLimit = buffer.currentSize >= this.maxBytesPerFlush;
    const overRecordLimit = buffer.records.length >= this.maxRecordsPerFlush;
    const timeSinceLastFlush = Date.now() - buffer.lastFlushMillis;
    const overTimeLimit = timeSinceLastFlush >= this.maxMillisPerFlush;
    const shouldFlush = overSizeLimit || overRecordLimit || overTimeLimit;
    return shouldFlush;
  }

  /**
   * Iterate through sub buffers and flush them all.
   */
  async flushAllBuffers() {
    const keys = Object.keys(this.buffers);
    await Promise.all(keys.map(async (key) => {
      // get individual buffer and flush the records
      const buffer = this.buffers[key];
      await this.flushBuffer(buffer.records, key);
      buffer.clear();
    }));
  }
}

module.exports = PartitionedBuffer;
