import PartitionedBuffer from './partitioned-buffer';

export default class {

    constructor(delegate) {
        this.buffers = {};
        this.delegate = delegate;
    }

    async push(key, data) {
        // get internal buffer and push data
        if (!this.buffers[key]) {
            this.buffers[key] = new PartitionedBuffer();
        }

        const buffer = this.buffers[key];
        buffer.push(data);

        // check should flush and emit data
        if (buffer.shouldFlush()) {
            await this.delegate.bufferShouldFlush(buffer, key);
        }
    }

    async flushAllBuffers() {
        const keys = Object.keys(this.buffers);
        for (let key of keys) {
            // get individual buffer
            const buffer = this.buffers[key];

            // emit records
            await this.delegate.bufferShouldFlush(buffer, key);
        }
    }
}

