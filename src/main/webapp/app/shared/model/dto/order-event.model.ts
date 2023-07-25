type IType = 'CREATE_ORDER' | 'ADD_ITEM' | 'ADJUST_ITEM_QUANTITY' | 'NOTIFY_KITCHEN' | 'DELETE_ITEM';

export interface IOrderEvent {
  type: IType;
  orderId: string;
  rawData: string | null;
}
