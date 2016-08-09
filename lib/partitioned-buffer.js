export default class {
    constructor() {
        this.records = [];
        this.currentSize = 0;
        this.lastFlushMillis = Date.now();
        this.maxBytesPerFlush = 500000;
        this.maxRecordsPerFlush = 500;
        this.maxMillisPerFlush = 300000;

    }

    shouldFlush() {
        const overSizeLimit = this.currentSize >= this.maxBytesPerFlush;
        const overRecordLimit = this.records.length >= this.maxRecordsPerFlush;

        const timeSinceLastFlush = Date.now() - this.lastFlushMillis;
        const overTimeLimit = timeSinceLastFlush >= this.maxMillisPerFlush;

        const flush = overSizeLimit || overRecordLimit || overTimeLimit;

        return flush;

    }

    push(data) {
        const string = new Buffer(data, 'base64').toString('utf8');
        this.currentSize += string.length;
        const recordData = JSON.parse(string);

        const payload = recordData.data;

        this.records.push(payload);
    }

    clear() {
        this.records = [];
        this.currentSize = 0;
        this.lastFlushMillis = Date.now();
    }
}

