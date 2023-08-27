enum KitchenEvent {
  CreateOrder = 'create-order',
  ReceiveNewItem = 'receive-new-items',
  UpdateItems = 'update-items',
  NotifyReadyToServe = 'notify-ready-to-serve',
  HideRts = 'hide-rts',
  NotifyOutOfStock = 'notify-out-of-stock',
  ReceiveOrderCancellation = 'receive-order-cancellation',
}

export default KitchenEvent;
