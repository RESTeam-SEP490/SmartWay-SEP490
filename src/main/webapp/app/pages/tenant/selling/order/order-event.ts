enum OrderEvent {
  CreateOrder = 'create-order',
  ReceiveChangedOrder = 'receive-changed-order',
  HideOrder = 'hide-order',
  HasReadyToServeItem = 'has-ready-to-serve-item',
  HasServedItem = 'has-served-item',
  AddOrderDetail = 'add-order-detail',
  DeleteOrderDetail = 'delete-order-detail',
  ChangePriority = 'change-priority',
  NotifyKitchen = 'notify-kitchen',
  AjustDetailQuantity = 'adjust-detail-quantity',
  CancelOrderDetail = 'cancel-order-detail',
}

export default OrderEvent;
