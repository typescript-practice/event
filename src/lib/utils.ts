'use strict'
import { EventName, ListenerFunction } from './interface'
import EventEmitter from '../events'

export function isValidListener(listener: Function) {
  const isValid = isFunction(listener)
  if (!isValid) {
    throw new TypeError(`[events] the type of 'listener' is not valid`)
  }
  return isValid
}

export function isValidEventName(eventName: EventName) {
  const isValid = isString(eventName) || isSymbol(eventName)
  if (!isValid) {
    throw new TypeError(`[events] the type of 'eventName' is not valid`)
  }
  return isValid
}

export function isString(val: any) {
  return typeof val === 'string'
}

export function isSymbol(val: any) {
  return typeof val === 'symbol'
}

export function isFunction(val: any) {
  return typeof val === 'function'
}

export function isPositiveNumber(val: any) {
  return typeof val === 'number' && val >= 0
}

export const isArray = Array.isArray

/**
 * Finds the index of the listener for the event in its storage array.
 *
 * @param {Function[]} listeners Array of listeners to search through.
 * @param {Function} listener Method to look for.
 * @return {Number} Index of the specified listener, -1 if not found
 * @api private
 */
export function indexOfListener(listeners: ListenerFunction[], listener: Function): number {
  let i = listeners.length
  while (i--) {
    if (listeners[i] && listeners[i].listener === listener) {
      return i
    }
  }

  return -1
}

export function createListenerFunction(
  events: EventEmitter,
  eventName: EventName,
  listener: Function,
  once = false
) {
  const listenerFunction: any = function(...args: any[]) {
    listener.apply(events, args)
    if (once) {
      events.removeListener(eventName, listener)
    }
  }

  listenerFunction.listener = listener
  listenerFunction.once = once

  return listenerFunction as ListenerFunction
}
