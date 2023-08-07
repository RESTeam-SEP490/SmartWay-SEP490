import SockJS from 'sockjs-client';

import { Storage } from 'react-jhipster';
import { Observable } from 'rxjs';
import Stomp from 'webstomp-client';

import { receiveChangedTable } from 'app/pages/tenant/management/dining-table/dining-table.reducer';
import OrderEvent from 'app/pages/tenant/selling/order/order-event';
import { IOrder } from 'app/shared/model/order/order.model';
import { orderActions } from './order.reducer';
import { notification } from 'antd';

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

const sound = new Audio('/content/sound/notification.mp3');

const subscribe = (topicPath: string) => {
  connection.then(() => {
    subscriber = stompClient.subscribe(`/orders/${subdomain}/${topicPath}`, data => {
      const toUpdateOrder = JSON.parse(data.body);
      if (topicPath === OrderEvent.HasReadyToServeItem || topicPath === OrderEvent.HasServedItem) {
        const itemInfo = data.headers.item;
        notification.info({ message: itemInfo + 'đang chờ phục vụ' });
        sound.play();
        console.log('a');
      }
      listenerObserver.next(toUpdateOrder);
    });
  });
};

export const connect = () => {
  // if (connectedPromise !== null || alreadyConnectedOnce) {
  //   // the connection is already being established
  //   return;
  // }
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
  if (orderActions.startConnecting.match(action)) {
    connect();

    if (stompClient !== null) {
      store.dispatch(orderActions.connectionEstablished());

      subscribe(OrderEvent.ReceiveChangedOrder);
      subscribe(OrderEvent.HasReadyToServeItem);
      subscribe(OrderEvent.HasServedItem);
      receive().subscribe((order: IOrder) => {
        store.dispatch(orderActions.receiveChangedOrder(order));
        store.dispatch(receiveChangedTable(order.tableList));
      });
    }
  }

  if (orderActions.createOrder.match(action) && alreadyConnectedOnce) {
    const currentTablelist = store.getState().order.currentOrder.tableList;
    send(OrderEvent.CreateOrder, { menuItemId: action.payload, tableIdList: currentTablelist.map(table => table.id) });
  }

  if (orderActions.adjustDetailQuantity.match(action) && alreadyConnectedOnce) {
    send(OrderEvent.AjustDetailQuantity, action.payload);
  }

  if (orderActions.addOrderDetail.match(action) && alreadyConnectedOnce) {
    send(OrderEvent.AddOrderDetail, { ...action.payload, orderId: store.getState().order.currentOrder.id });
  }

  if (orderActions.deleteOrderDetail.match(action) && alreadyConnectedOnce) {
    send(OrderEvent.DeleteOrderDetail, action.payload);
  }

  if (orderActions.notifyKitchen.match(action) && alreadyConnectedOnce) {
    send(OrderEvent.NotifyKitchen, action.payload);
  }

  if (orderActions.changePriority.match(action) && alreadyConnectedOnce) {
    send(OrderEvent.ChangePriority, action.payload);
  }

  if (orderActions.disconnectStomp.match(action) && alreadyConnectedOnce) {
    disconnect();
  }

  next(action);
};

const send = (orderEvent: OrderEvent, body: any) => {
  connection?.then(() => {
    stompClient?.send(
      `/orders/${subdomain}/${orderEvent}`, // destination
      JSON.stringify(body), // body
      getHeader() // header
    );
  });
};
