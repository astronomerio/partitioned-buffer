class SubBuffer {
  constructor() {
    this.records = [];
    this.lastFlushMillis = Date.now();
  }

  push(data) {
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
