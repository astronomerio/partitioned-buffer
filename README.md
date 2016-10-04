[![CircleCI](https://circleci.com/gh/astronomerio/partitioned-buffer.svg?style=svg)](https://circleci.com/gh/astronomerio/partitioned-buffer)

# partitioned-buffer

### Description
Partitioned buffer is an object that maintains an internal list of sub buffers partitioned by a key you specify. Each sub buffer can store its own separate data and emit the data according to criteria you specify.

### Installation

```javascript
npm install astronomerio/partitioned-buffer#1.0.0
```

### Usage

#### Creating a partitioned buffer

Import the main class from 'partitioned-buffer' and instantiate it with a "flush" callback that will be invoked any time an internal buffer emits its data.
The callback function is fit to handle returning a Promise or be marked as 'async'.

```javascript
import PartitionedBuffer from '@astronomerio/partitioned-buffer';

const partitionedBuffer = new PartitionedBuffer(function (data, key) {
  // do something with data, such as put to s3
  // data is the array of all the records you pushed onto the buffer
  // key is the key by which this buffer was partitioned
});
```

You can optionally pass in an options object as the second parameter in the constructor. The options specify the criteria for when an internal buffer will emit its data.

```javascript
const options = {
  maxBytesPerFlush: 500000,
  maxRecordsPerFlush: 500,
  maxMillisPerFlush = 300000 // 5 minutes
};
```

#### Pushing data onto the buffer

Simply call ```partitionedBuffer.push(key, data)``` and supply a key that will reference the internal buffer which stores the data. The partitioned buffer does not perform any transormations on the data, it will emit the exact data you passed in.

```javascript
partitionedBuffer.push('h2jkl345hl', { event_name: 'track', timestamp: '09/22/2016' });
```

### License

&copy; Copyright Astronomer, Inc 2016

You may use, copy and redistribute this library under the [MIT license](http://www.opensource.org/licenses/MIT).
