enum KitchenEvent {
  CreateOrder = 'create-order',
  ReceiveNewItem = 'receive-new-items',
  UpdateItems = 'update-items',
  NotifyReadyToServe = 'notify-ready-to-serve',
  NotifyServed = 'notify-served',
  NotifyOutOfStock = 'notify-out-of-stock',
  ReceiveOrderCancellation = 'receive-order-cancellation',
}

export default KitchenEvent;
