import SockJS from 'sockjs-client';

import { Storage } from 'react-jhipster';
import { Observable } from 'rxjs';
import Stomp from 'webstomp-client';

import { kitchenActions } from 'app/pages/tenant/selling/kitchen/kitchen.reducer';
import { IKitchenItems } from '../../../../shared/model/dto/kitchen-items-dto';
import KitchenEvent from './kitchen-event';

let stompClient = null;
let subscriber = null;
let connection: Promise<any>;
let connectedPromise: any = null;
let listener: Observable<any>;
let listenerObserver: any;
let alreadyConnectedOnce = false;
const subdomain = window.location.host.split('.')[0];

const createConnection = (): Promise<any> => new Promise(resolve => (connectedPromise = resolve));

const createListener = (): Observable<any> =>
  new Observable(observer => {
    listenerObserver = observer;
  });

const newItemsound = new Audio('/content/sound/new-item-sound.mp3');
const cancellationSound = new Audio('/content/sound/cancellation-sound.mp3');

const subscribe = (topicPath: string) => {
  connection.then(() => {
    subscriber = stompClient.subscribe(`/kitchen/${subdomain}/${topicPath}`, data => {
      if (topicPath === KitchenEvent.ReceiveNewItem) newItemsound.play();
      if (topicPath === KitchenEvent.ReceiveOrderCancellation) cancellationSound.play();
      listenerObserver.next(JSON.parse(data.body));
    });
  });
};

export const connect = () => {
  if (connectedPromise !== null || alreadyConnectedOnce) {
    // the connection is already being established
    return;
  }
  connection = createConnection();
  listener = createListener();

  // building absolute path so that websocket doesn't fail when deploying with a context path
  const loc = window.location;
  const baseHref = document.querySelector('base').getAttribute('href').replace(/\/$/, '');

  const authToken = Storage.local.get('jhi-authenticationToken') || Storage.session.get('jhi-authenticationToken');

  let url = '//' + loc.host + baseHref + '/websocket/orders';
  if (authToken) {
    url += '?access_token=' + authToken;
  }

  const socket = new SockJS(url);
  stompClient = Stomp.over(socket, { protocols: ['v12.stomp'] });

  stompClient.connect(
    getHeader(),
    () => {
      connectedPromise('success');
      connectedPromise = null;
      alreadyConnectedOnce = true;
    },
    onConnectFailed
  );
};

export const getHeader = () => {
  const headers = {};
  const authToken = Storage.local.get('jhi-authenticationToken') || Storage.session.get('jhi-authenticationToken');
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  headers['X-restaurant-subdomain'] = window.location.host.split('.')[0];
  return headers;
};

const disconnect = () => {
  if (stompClient !== null) {
    if (stompClient.connected) {
      stompClient.disconnect();
    }
    stompClient = null;
  }
  alreadyConnectedOnce = false;
};

const receive = () => listener;

const unsubscribe = (topicPath: string) => {
  if (subscriber[topicPath] !== null) {
    subscriber[topicPath].unsubscribe();
  }
  listener = createListener();
};

const onConnectFailed = error => {
  console.log('STOMP: ' + error);

  setTimeout(connect, 3000);
  console.log('Reconnect in 3s');
};

export default store => next => action => {
  if (kitchenActions.startConnecting.match(action)) {
    connect();

    if (stompClient !== null) {
      store.dispatch(kitchenActions.connectionEstablished());

      subscribe(KitchenEvent.ReceiveNewItem);
      subscribe(KitchenEvent.UpdateItems);
      subscribe(KitchenEvent.ReceiveOrderCancellation);
      receive().subscribe((kitchenItems: IKitchenItems) => {
        store.dispatch(kitchenActions.receiveNewItem(kitchenItems));
      });
    }
  }

  if (kitchenActions.notifyReadyToServe.match(action) && alreadyConnectedOnce) {
    send(KitchenEvent.NotifyReadyToServe, action.payload);
  }
  if (kitchenActions.notifyServed.match(action) && alreadyConnectedOnce) {
    send(KitchenEvent.NotifyServed, action.payload);
  }

  if (kitchenActions.disconnectStomp.match(action) && alreadyConnectedOnce) {
    disconnect();
  }

  next(action);
};

const send = (orderEvent: KitchenEvent, body?: any) => {
  connection?.then(() => {
    stompClient?.send(
      `/kitchen/${subdomain}/${orderEvent}`, // destination
      body ? JSON.stringify(body) : null, // body
      getHeader() // header
    );
  });
};
