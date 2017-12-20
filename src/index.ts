import { iOptions,
  iCollectionItem,
  IDictionary,
  wsEvent,
  Observer,
  appEvent,
  isocketObsFactoryMap,
  iSocketToObservable
} from './interfaces';
import { Observable, Subject } from 'rxjs/Rx';
import * as io from 'socket.io-client';


export class SocketToObservable implements iSocketToObservable {
  /**
  * Url to the socket.io server
  */
  private connection: string;
  /**
  * A boolean switch used to determine connection status. Used for determining whether to publish
  * to the server or cache the push to localstorage.
  */
  private isConnectionAlive: boolean;
  /**
  * Holds the socket.io socket
  */
  private Socket: SocketIOClient.Socket;
  /**
  * Populated with the namespace sockets.
  */
  private collSockets: IDictionary<SocketIOClient.Socket> = {};

  /**
  * Holds the main observable from which you can listen to all registered traffic coming through
  * the socket.
  */
  private _masterHotObservable: Subject<wsEvent> = new Subject<wsEvent>();
  /**
  * Public getter for the master observable.
  */
  public get masterObservable(): Subject<wsEvent> {
    return this._masterHotObservable;
  }

  /**
  * @param iOptions is an object holding parameters connection and socketObsFactoryMap.
  * You can check out the interface definitions.
  */
  constructor({connection, socketObsFactoryMap}: iOptions) {
      this.connection = connection;
      this.isConnectionAlive = false;
      this.init(socketObsFactoryMap);
  }
  /**
  * Prepares the administrative Observable connected to the main Socket.io Socket. At the end, it calls
  * the socketToObservable method.
  */
  private init = (socketObsFactoryMap: isocketObsFactoryMap): void => {
  const _message = (observer: Observer<wsEvent>, data: any) => {
    observer.next({
      name: 'message',
      wsmessage: data
    });
  }
  const _connect = (observer: Observer<wsEvent>) => {
      this.isConnectionAlive = true;
      observer.next({
        name: 'connect'
      })
  }

 const _disconnect = (observer: Observer<wsEvent>) => {
      observer.next({
        name: 'disconnect'
      })
  }

 const  _reconnectAttempt = (observer: Observer<wsEvent>) => {
    observer.next({
      name: 'reconnect attempt'
    })

  }

  const _reconnect = (observer: Observer<wsEvent>) => {
    observer.next({
      name: 'reconnected'
    })
  }

 const  _reconnectError = (observer: Observer<wsEvent>) => {
    observer.next({
      name: 'reconnect error'
    })
  }

  const _reconnectFailed = (observer: Observer<wsEvent>) => {
    observer.next({
      name: 'reconnect failed'
    })
  }
    this.Socket = io(`${this.connection}/`);
    let observable = Observable.create((observer: Observer<wsEvent>) => {
      this.Socket.on('message', _message.bind(this, observer));
      this.Socket.on('connect', _connect.bind(this, observer));
      this.Socket.on('disconnect', _disconnect.bind(this, observer));
      this.Socket.on('reconnect_attempt', _reconnectAttempt.bind(this, observer));
      this.Socket.on('reconnect', _reconnect.bind(this, observer));
      this.Socket.on('reconnect_error', _reconnectError.bind(this, observer));
      this.Socket.on('reconnect_failed', _reconnectFailed.bind(this, observer));
    });

    observable.subscribe(this._masterHotObservable);

    this.socketToObservable(socketObsFactoryMap);
  }
/**
* @param socketObsFactoryMap checkout the isocketObsFactoryMap interface definition.
* Essentially, its just a javascript object with the keys as the socket namespace name that will be generated
* and an observable factory as the value.
* @returns void
*/
private socketToObservable = (socketObsFactoryMap: isocketObsFactoryMap) => {
    Object.keys(socketObsFactoryMap).forEach((obsFactory: string) => {
      if (!this.collSockets[obsFactory]) {
        this.collSockets[obsFactory] = io(`${this.connection}/${obsFactory}`);
      }
      socketObsFactoryMap[obsFactory](this.collSockets[obsFactory]).subscribe(this._masterHotObservable);
    });
  }

  /**
  * @param socket holds the name of the socket/namespace you want to publish
  * @param endpoint the endpoint of the socket you are targeting.
  * @param data the data you want to pass over to the websocket endpoint
  * @param token to authenticate the payload
  */
  public publish = (socket: string, endpoint: string, data?: any, token?: string): void => {
    let newData;
      if (!!data) {
        newData = {
          ...data, token
        }
      } else {
        newData = {
          token
        }
      }
      if (this.isConnectionAlive) {
          this.collSockets[socket].emit(endpoint, newData);
      } else if (!this.isConnectionAlive && newData.token) {
          // saveToLocalStorage(socket, endpoint, data)
      }
  }
}

// function saveToLocalStorage(socket: string, endpoint: string, data: any) {
//     let savedData = getFromLocalStorage(endpoint);
//     let ls = savedData || [];
//     ls.push(data);
//     localStorage.setItem(endpoint, JSON.stringify(ls));
// }

// function clearCollection(collection: string) {
//     localStorage.setItem(collection, null);
// }

// function getFromLocalStorage(collection: string) {
//     return JSON.parse(localStorage.getItem(collection));
// }
