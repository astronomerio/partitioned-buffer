import sinon from 'sinon';
import test from 'blue-tape';
import SubBuffer from '../lib/sub-buffer';

test('buffer pushes data', (t) => {
    const subBuffer = new SubBuffer();
    const data = ['foo', 'bar'];
    subBuffer.push(data);
    t.equal(data, subBuffer.records);
});

