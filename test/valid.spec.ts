'use strict'
import EventEmitter from '../src/events'

const NOOP = function() {
  // empty
}
// Basics
test('check if match max listener', () => {
  const events = new EventEmitter()
  events.setMaxListeners(2)
  events.on('testName1', NOOP)
  events.on('testName2', NOOP)
  events.on('testName1', NOOP)
  expect(() => {
    events.on('testName1', NOOP)
  }).toThrow(RangeError)
})

test('set MaxListeners = 0', () => {
  const events = new EventEmitter()
  events.setMaxListeners(0)
  const MAX = 100
  expect(() => {
    while (MAX > 0) {
      events.on('testName1', NOOP)
      MAX--
    }
    expect(events.listenerCount('testName1')).toEqual(100)
  }).not.toThrow(RangeError)
})

test('invalid arguments', () => {
  const events = new EventEmitter()
  expect(() => {
    events.on(null as any, 123 as any)
  }).toThrow(TypeError)
  expect(() => {
    events.on('null', 123 as any)
  }).toThrow(TypeError)
})
