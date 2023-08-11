import { IDiningTable } from '../dining-table.model';
import { IKitchenNotificationHistory } from './kitchen-notification-history.model';
import { IOrderDetail } from './order-detail.model';

export interface IOrder {
  id?: string;
  code?: string | null;
  isPaid?: boolean | null;
  takeAway?: boolean | null;
  createdDate?: string;
  tableList?: IDiningTable[];
  orderDetailList?: IOrderDetail[];
  kitchenNotificationHistoryList?: IKitchenNotificationHistory[];
}

export const defaultValue: Readonly<IOrder> = {
  id: null,
  code: '',
  isPaid: false,
  takeAway: false,
  tableList: [],
  orderDetailList: [],
  kitchenNotificationHistoryList: [],
};
