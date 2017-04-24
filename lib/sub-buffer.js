class SubBuffer {
  constructor() {
    this.records = [];
    this.lastFlushMillis = Date.now();
  }

  push(data) {
    // TODO: add some checks for types of data to get the number of bytes so we can compare against maxByteSize
    this.records.push(data);
  }

  clear() {
    this.records = [];
    this.lastFlushMillis = Date.now();
  }

  currentSize() {
    return this.records.length || 0;
  }
}

module.exports = SubBuffer;
