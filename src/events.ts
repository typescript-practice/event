'use strict'
import { DEFAULT_MAX_LISTENER, NEW_LISTENER, REMOVE_LISTENER } from './lib/const'
import { EventName, Events, ListenerFunction } from './lib/interface'
import {
  createListenerFunction,
  indexOfListener,
  isArray,
  isPositiveNumber,
  isValidEventName,
  isValidListener
} from './lib/utils'

/**
 */
export default class EventEmitter {
  private _events: Events = {}
  private _maxListeners: number = DEFAULT_MAX_LISTENER
  private defaultMaxListeners: number = DEFAULT_MAX_LISTENER

  // /**
  //  * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
  //  * @return {Function} Non conflicting EventEmitter class.
  //  * TODO
  //  */
  // static noConflict(): Function {
  //   return EventEmitter
  // }

  // get _eventsCount() {
  //   return this.eventNames().length
  // }

  /**
   * Returns the current max listener value for the EventEmitter
   * which is either set by emitter.setMaxListeners(n) or defaults
   * to EventEmitter.defaultMaxListeners.
   * @return {number}
   */
  getMaxListeners(): number {
    return this._maxListeners
  }

  /**
   * By default EventEmitters will print a warning if more than 10
   * listeners are added for a particular event. This is a useful
   * default that helps finding memory leaks. Obviously, not all
   * events should be limited to just 10 listeners.
   * The emitter.setMaxListeners() method allows the limit to be
   * modified for this specific EventEmitter instance. The value
   * can be set to Infinity (or 0) to indicate an unlimited
   * number of listeners.
   * @param {number} maxListeners - The number of max listeners.
   * @return {EventEmitter}
   */
  setMaxListeners(maxListeners: number): EventEmitter {
    if (!isPositiveNumber(maxListeners)) {
      throw new TypeError('[events] MaxListeners number must be a positive number!')
    }

    this._maxListeners = maxListeners

    return this
  }

  /**
   * Returns an array listing the events for which the emitter
   * has registered listeners. The values in the array will be
   * strings or Symbols.
   * @param {EventName} eventName - The name of the event.
   * @param {any[]} [...args] - arguments pass to event listener.
   * @return {boolean} Returns true if the event had listeners, false otherwise.
   */
  emit(eventName: EventName, ...args: any[]): boolean {
    const _events = this._getEvents()
    if (_events.hasOwnProperty(eventName)) {
      let listeners: ListenerFunction[] = _events[eventName].concat()
      const hasListeners = listeners.length > 0

      listeners.forEach(listenerFunction => listenerFunction.apply(this, args))

      return hasListeners
    }
    return false
  }

  /**
   * Returns an array listing the events for which the emitter
   * has registered listeners. The values in the array will be
   * strings or Symbols.
   * @return {EventName[]}
   */
  eventNames(): EventName[] {
    const _events = this._getEvents()
    return Object.keys(_events) || []
  }

  /**
   * Returns the number of listeners listening to the event named eventName.
   * @param {EventName} eventName - The name of the event.
   * @return {number}
   */
  listenerCount(eventName: EventName): number {
    const _events = this._getEvents()
    if (_events.hasOwnProperty(eventName) && isArray(_events[eventName])) {
      return _events[eventName].length
    }
    return 0
  }

  /**
   * Returns a copy of the array of listeners for the event named eventName.
   * @param {EventName} eventName - The name of the event.
   * @return {Function[]}
   */
  listeners(eventName: EventName): Function[] {
    const _events = this._getEvents()
    let _listeners: Function[] = []
    if (_events.hasOwnProperty(eventName)) {
      let _rawListeners = _events[eventName]
      _rawListeners.forEach(item => {
        _listeners.push(item.listener)
      })
    }
    return _listeners
  }

  /**
   * Returns a copy of the array of listeners for the event named eventName.
   * @param {EventName} eventName - The name of the event.
   * @param {Function} listener - The callback function
   * @return {EventEmitter}
   */
  addListener(eventName: EventName, listener: Function): EventEmitter {
    return this._addListener(eventName, listener, false, false)
  }

  /**
   * Returns a copy of the array of listeners for the event named eventName.
   * @param {EventName} eventName - The name of the event.
   * @param {Function} listener - The callback function
   * @return {EventEmitter}
   */
  on(eventName: EventName, listener: Function): EventEmitter {
    return this._addListener(eventName, listener, false, false)
  }

  /**
   * Adds a one-time listener function for the event named eventName.
   * The next time eventName is triggered, this listener is removed
   * and then invoked.
   * @param {EventName} eventName - The name of the event.
   * @param {Function} listener - The callback function
   * @return {EventEmitter}
   */
  once(eventName: EventName, listener: Function): EventEmitter {
    return this._addListener(eventName, listener, true, false)
  }

  /**
   * Adds the listener function to the beginning of the listeners array
   * for the event named eventName. No checks are made to see if the
   * listener has already been added. Multiple calls passing the same
   * combination of eventName and listener will result in the listener
   * being added, and called, multiple times.
   * @param {EventName} eventName - The name of the event.
   * @param {Function} listener - The callback function
   * @return {EventEmitter}
   *
   * @example
   * server.prependListener('connection', (stream) => {
   *      console.log('someone connected!');
   * });
   */
  prependListener(eventName: EventName, listener: Function): EventEmitter {
    return this._addListener(eventName, listener, false, true)
  }

  /**
   * Adds a one-time listener function for the event named eventName to the
   * beginning of the listeners array. The next time eventName is triggered,
   * this listener is removed, and then invoked.
   * @param {EventName} eventName - The name of the event.
   * @param {Function} listener - The callback function
   * @return {EventEmitter}
   */
  prependOnceListener(eventName: EventName, listener: Function): EventEmitter {
    return this._addListener(eventName, listener, true, true)
  }

  /**
   * Removes all listeners, or those of the specified eventName.
   * @param {EventName[]} eventNames - The names array of the event.
   * @return {EventEmitter}
   */
  removeAllListeners(eventNames?: EventName[]): EventEmitter {
    const _events = this._getEvents()
    if (eventNames && isArray(eventNames) && eventNames.length > 0) {
      // remove the specified eventName list
      let i = 0
      let len = eventNames.length
      for (; len > i; i++) {
        const _eventName = eventNames[i]
        if (_events.hasOwnProperty(_eventName)) {
          delete _events[_eventName]
        }
      }
    } else {
      // remove all
      this._events = {}
    }

    // The 'removeListener' event is emitted after the listener is removed.
    this.emit(REMOVE_LISTENER)

    return this
  }

  /**
   * Removes all listeners, or those of the specified eventName.
   * @param {EventName} eventName - The name of the event.
   * @param {Function} listener - The callback function
   * @return {EventEmitter}
   */
  removeListener(eventName: EventName, listener: Function): EventEmitter {
    return this._removeListener(eventName, listener)
  }

  /**
   * Removes all listeners, or those of the specified eventName.
   * @param {EventName} eventName - The name of the event.
   * @param {Function} listener - The callback function
   * @return {EventEmitter}
   */
  off(eventName: EventName, listener: Function): EventEmitter {
    return this._removeListener(eventName, listener)
  }

  /**
   * Returns a copy of the array of listeners for the event named
   * eventName, including any wrappers (such as those created by .once).
   * @param {EventName} eventName - The name of the event.
   * @return {ListenerFunction[]}
   */
  rawListeners(eventName: EventName): ListenerFunction[] {
    const _events = this._getEvents()
    let _rawListeners: ListenerFunction[] = []
    if (_events.hasOwnProperty(eventName)) {
      _rawListeners = _events[eventName].concat()
    }
    return _rawListeners
  }

  /**
   * 检查当前事件名是否超过设定的最大监听数
   * @param {EventName} eventName - The name of the event.
   * @return {boolean}
   * @private
   */
  private _checkIfMatchMaxListener(eventName: EventName): boolean {
    if (this._maxListeners === undefined || this._maxListeners === 0) return false

    const _events = this._getEvents()
    let _res = false

    if (_events.hasOwnProperty(eventName) && isArray(_events[eventName])) {
      const length = _events[eventName].length
      _res = length > this._maxListeners
      if (_res) {
        /* istanbul ignore next */
        throw new RangeError(`
        [events] The current event ${eventName}(${length}) has exceeded the maximum 
        number of listeners(${this._maxListeners}), You need to be aware of the  
        existence of possible EventEmitter memory leak!
        `)
      }
    }

    return _res
  }

  /**
   * Removes all listeners, or those of the specified eventName.
   * @param {EventName} eventName - The name of the event.
   * @param {Function} listener - The callback function
   * @return {EventEmitter}
   */
  private _removeListener(eventName: EventName, listener: Function): EventEmitter {
    const _events = this._getEvents()
    if (!_events.hasOwnProperty(eventName)) return this

    const listeners = _events[eventName]

    if (isArray(listeners) && listeners.length > 0) {
      const index = indexOfListener(listeners, listener)
      if (index !== -1) {
        listeners.splice(index, 1)
      }
    }

    if (!isArray(listeners) || listeners.length === 0) {
      delete _events[eventName]
    }

    // The 'removeListener' event is emitted after the listener is removed.
    this.emit(REMOVE_LISTENER)

    return this
  }

  /**
   * 添加监听
   * @param {EventName} eventName - The name of the event.
   * @param {Function} listener - The callback function
   * @param {Boolean} [once=false] - once or not
   * @param {Boolean} [prepend=false] - prepend or not
   * @return {EventEmitter}
   * @private
   */
  private _addListener(
    eventName: EventName,
    listener: Function,
    once = false,
    prepend = false
  ): EventEmitter {
    if (!isValidEventName(eventName) || !isValidListener(listener)) {
      /* istanbul ignore next */
      throw new TypeError(`[events] Invalid arguments of 'eventName' or 'listener'!`)
    }

    const _events = this._getEvents()

    if (!_events.hasOwnProperty(eventName)) {
      _events[eventName] = []
    }

    if (!isArray(_events[eventName])) {
      /* istanbul ignore next */
      throw new TypeError('[events] The events[eventName] must be array type!')
    }

    const prependMethod = prepend ? 'unshift' : 'push'

    // emit "NEW_LISTENER" before added
    if (NEW_LISTENER !== eventName) {
      this.emit(NEW_LISTENER, eventName, listener)
    }

    _events[eventName][prependMethod](createListenerFunction(this, eventName, listener, once))

    this._checkIfMatchMaxListener(eventName)

    return this
  }

  /**
   * Fetches the events object and creates one if required.
   *
   * @return {Events} The events storage object.
   */
  private _getEvents(): Events {
    return this._events || (this._events = {})
  }
}
