import SockJS from 'sockjs-client';

import Stomp from 'webstomp-client';
import { Observable } from 'rxjs';
import { Storage } from 'react-jhipster';

import { websocketActivityMessage } from 'app/modules/administration/administration.reducer';
import { getAccount, logoutSession } from 'app/shared/reducers/authentication';
import { getEntities, selectTab, setChangedDetailId, websocketUpdateOrder } from './order.reducer';
import getStore from 'app/config/store';
import { IOrderEvent } from 'app/shared/model/dto/order-event.model';
import { websocketUpdateTable } from '../../management/dining-table/dining-table.reducer';

let stompClient = null;

let subscriber = null;
let connection: Promise<any>;
let connectedPromise: any = null;
let listener: Observable<any>;
let listenerObserver: any;
let alreadyConnectedOnce = false;
const subdomain = window.location.host.split('.')[0];
const store = getStore();

const createConnection = (): Promise<any> => new Promise(resolve => (connectedPromise = resolve));

const createListener = (): Observable<any> =>
  new Observable(observer => {
    listenerObserver = observer;
  });

const subscribe = () => {
  connection.then(() => {
    subscriber = stompClient.subscribe('/topic/orders/' + subdomain, data => {
      const order = JSON.parse(data.body);
      store.dispatch(websocketUpdateOrder(order));
      store.dispatch(websocketUpdateTable(order));
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

  stompClient.connect(getHeader(), () => {
    connectedPromise('success');
    connectedPromise = null;
    alreadyConnectedOnce = true;
  });
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

const unsubscribe = () => {
  if (subscriber !== null) {
    subscriber.unsubscribe();
  }
  listener = createListener();
};

export const connectOrderWebSocket = () => {
  connect();
  if (!alreadyConnectedOnce) {
    subscribe();
    receive().subscribe(order => {
      return null;
    });
  }
};

export const sendEvent = (event: IOrderEvent) => {
  connection?.then(() => {
    stompClient?.send(
      '/topic/orders-event/' + subdomain, // destination
      JSON.stringify(event), // body
      getHeader() // header
    );
  });
};

export const adjustItemQuantity = (dto, orderId: string) => {
  const event: IOrderEvent = {
    type: 'ADJUST_ITEM_QUANTITY',
    orderId,
    rawData: JSON.stringify(dto),
  };
  sendEvent(event);
  store.dispatch(setChangedDetailId(dto.orderDetailId));
  store.dispatch(selectTab('ordering-tab'));
};

export const addItem = (dto, orderId: string) => {
  const event: IOrderEvent = {
    type: 'ADD_ITEM',
    orderId,
    rawData: JSON.stringify(dto),
  };
  sendEvent(event);
  store.dispatch(selectTab('ordering-tab'));
};

export const notifyKitchen = orderId => {
  sendEvent({ type: 'NOTIFY_KITCHEN', orderId, rawData: orderId });
  store.dispatch(selectTab('ordered-tab'));
};

export const removeItem = (orderDetailId, orderId) => {
  sendEvent({ type: 'DELETE_ITEM', orderId, rawData: orderDetailId });
};
