import { IDiningTable, defaultValue as tableDefault } from './dining-table.model';
import { IOrderDetail } from './order-detail.model';

export interface IOrder {
  id?: string;
  code?: string | null;
  isPaid?: boolean | null;
  table?: IDiningTable | null;
  items?: IOrderDetail[] | [];
}

export const defaultValue: Readonly<IOrder> = {
  id: null,
  code: '',
  isPaid: null,
  table: tableDefault,
  items: [],
};
