export type EventName = string | symbol;

export interface Events {
  [EventName: string]: ListenerFunction[] //Function | Function[]
}

export interface ListenerFunction {
  (...args: any[]): any;

  listener: Function,
  once: Boolean,
}
