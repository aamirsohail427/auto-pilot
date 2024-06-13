import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

@Injectable()
export class GlobalState {

  private data = new Subject<Object>();
  private dataStream = this.data.asObservable();

  private subscriptions: Map<string, Array<Function>> = new Map<string, Array<Function>>();

  constructor() {
    this.dataStream.pipe(throttleTime(5000)).subscribe((data) => this._onEvent(data));
  }

  notifyDataChanged(event, value) {
    this.data[event] = value;
    this.data.next({
      event: event,
      data: this.data[event]
    });
  }

  subscribe(event: string, callback: Function) {
    const subscribers = this.subscriptions.get(event) || [];
    subscribers.push(callback);

    this.subscriptions.set(event, subscribers);
  }

  unSubscribe(event: string, callback: Function) {
    const subscribers = this.subscriptions.get(event) || [];
    const index = subscribers.findIndex((value) => value === callback);
    subscribers.splice(index, 1);
  }

  _onEvent(data: any) {
    const subscribers = this.subscriptions.get(data['event']) || [];

    subscribers.forEach((callback) => {
      callback.call(null, data['data']);
    });
  }
}
