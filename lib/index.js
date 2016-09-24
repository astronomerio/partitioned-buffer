import SubBuffer from './sub-buffer';

export default class PartitionedBuffer {
    constructor(flushBuffer, options = {}) {
        this.buffers = {};
        this.maxBytesPerFlush = options.maxBytesPerFlush || 500000;
        this.maxRecordsPerFlush = options.maxRecordsPerFlush ||  500;
        this.maxMillisPerFlush = options.maxMillisPerFlush || 300000;
        this.flushBuffer = flushBuffer;
    }

    async push(key, data) {
        // get internal buffer and push data
        const buffer = this.getBufferWithKey(key);
        this.pushDataToBuffer(buffer, data);
        // check should flush and emit data
        if (this.bufferShouldFlush(buffer)) {
            await this.flushBuffer(buffer.records, key);
            this.clearBuffer(buffer);
        }
    }

    getBufferWithKey(key) {
        const buffer = this.buffers[key];
        if (buffer) {
            return buffer; 
        }

        this.buffers[key] = new SubBuffer();
        return this.buffers[key];
    }

    pushDataToBuffer(buffer, data) {
        buffer.push(data);
    }

    clearBuffer(buffer) {
        buffer.clear();
    }

    bufferShouldFlush(buffer) {
        const overSizeLimit = buffer.currentSize >= this.maxBytesPerFlush;
        const overRecordLimit = buffer.records.length >= this.maxRecordsPerFlush;
        const timeSinceLastFlush = Date.now() - buffer.lastFlushMillis;
        const overTimeLimit = timeSinceLastFlush >= this.maxMillisPerFlush;
        const shouldFlush = overSizeLimit || overRecordLimit || overTimeLimit;
        return shouldFlush;
    }

    async flushAllBuffers() {
        const keys = Object.keys(this.buffers);
        for (let key of keys) {
            // get individual buffer and flush the records
            const buffer = this.buffers[key];
            await this.flushBuffer(buffer.records, key);
            this.clearBuffer(buffer);
        }
    }
};
