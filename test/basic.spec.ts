'use strict'
import EventEmitter from '../src/events';

// Basics
test('basic', (cb) => {
  const events = new EventEmitter();
  events.on('testName', function (this: any, a: any, b: any) {
    expect(a).toEqual('value1');
    expect(b).toEqual('value2');
    expect(this).toEqual(events);
    cb()
  })
  events.emit('testName', 'value1', 'value2')
});
