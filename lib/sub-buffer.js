export default class SubBuffer {
    constructor(options = {}) {
        this.records = [];
        this.currentSize = 0;
        this.lastFlushMillis = Date.now();
    }

    push(data) {
        // TODO: add some checks for types of data to get the number of bytes so we can compare against maxByteSize
        this.records.push(data);
    }

    clear() {
        this.records = [];
        this.currentSize = 0;
        this.lastFlushMillis = Date.now();
    }
};
