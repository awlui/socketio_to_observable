import {Observable, Subject} from 'rxjs/Rx';
export interface iOptions {
    connection: string,
    socketObsFactoryMap: isocketObsFactoryMap
}

export interface iCollectionItem {
    name: string,
    subscribers: Array<Function>
}
export interface IDictionary<T> {
    [key: string]: T;
};

export interface wsEvent {
  name: string,
  wsmessage?: any
}

export interface appEvent {
  name: string,
  wsmessage?: any
}

export interface Observer<T> {
  closed?: boolean;
  next: (value: T) => void;
  error: (err: any) => void;
  complete: () => void;
}

export interface isocketObsFactoryMap {
  [key: string]: iObsFactory;
}

export interface iObsFactory {
  (socket: SocketIOClient.Socket): Observable<any>
}

export interface iSocketToObservable {
  masterObservable: Subject<wsEvent>;
  publish: (socket: string, endpoint: string, data?: any, token?: any) => void;
}
