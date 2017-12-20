# SocketIOToObservable
> A library to leverage socket.io's out of the box support for namespace.
> You supply the library a mapping of strings, representing the namespaces, to
> Observable Factories. The library will handle creation of the socket namespace and
> connect it to an Observable. Those observables get pooled into a master observable
> and you can listen in for events that you registered on that namespace. It might
> be better to look at code examples.


## Example of Observable Factory
```
function chatroomObsFactory(socket) {
    const _message = (observer, data) => {
      observer.next({
        name: 'message',
        wsmessage: data
      });
    }
    const _getChatroom = (observer, data) => {
      observer.next({
        name: 'getChatroom',
        wsmessage: {chatroom: data}
      });
    }
    const _getUserReturn = (observer, data) => {
        observer.next({
            name: 'getUserReturn',
            wsmessage: {users: data}
            });
    }
  let observable = Observable.create((observer) => {
    socket.on('message', _message.bind(this, observer));
    socket.on('getChatroom', _getChatroom.bind(this, observer))
    socket.on('getUserReturn', _getUserReturn.bind(this, observer))
  });
  return observable;
}

```
## Register your Obs Factories to namespaces
```
let manager = new SocketToObservable({
  connection: 'websocketServerURL',
  socketObsFactoryMap: {
    'auth': authObsFactory,
    'chatrooms': chatroomObsFactory,
    'friends': friendsObsFactory
  }
});
```

## Listen in on the master observable (One way)
```
manager.masterObservable.subscribe((event) => {
    switch(event.name) {
        case 'message':
            //Handle message event
            break;
        case 'getChatroom':
            //Handle getChatroom event
            break;
        case 'getUserReturn':
            //Handle getUserReturn event
            break;
        default:
    }
})
```

## Communicate back to socket
```
manager.publish('chatrooms', 'getUsers', null, 'token string');
```
