import PartitionedBuffer from './partitioned-buffer';

export default class {
    constructor(emitter) {
        this.buffers = {};
        this.emitter = emitter;
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
            await this.readAndClearBuffer(buffer);
        }
    }

    async flushAllBuffers() {
        const keys = Object.keys(this.buffers);
        for (let key of keys) {
            // get individual buffer
            const buffer = this.buffers[key];

            // emit records
            await this.readAndClearBuffer(buffer);
        }
    }

    async readAndClearBuffer(buffer) {
        await this.emitter.emit(buffer.records);
        buffer.clear();
    }
}

