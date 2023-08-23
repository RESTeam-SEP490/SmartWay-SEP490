import { IDiningTable } from './dining-table.model';
import { IOrderDetail } from './order/order-detail.model';

export interface IBill {
  id?: string;
  code?: string;
  sumMoney?: number;
  discount?: number;
  payDate?: string;
  cashier?: string;
  takeAway?: boolean;
  tableList?: IDiningTable[];
  orderDetailList?: IOrderDetail[];
}

export const defaultValue: Readonly<IBill> = {
  id: null,
  code: '',
  tableList: [],
  orderDetailList: [],
};
