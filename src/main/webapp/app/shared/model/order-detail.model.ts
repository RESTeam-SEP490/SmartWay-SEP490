import { IMenuItem } from './menu-item.model';

export interface IOrderDetail {
  id?: string;
  orderId?: string | null;
  menuItem?: IMenuItem | null;
  quantity?: number | 0;
  isCooked?: boolean | null;
  notifiedTime?: Date | null;
  note?: string | null;
}

export const defaultValue: Readonly<IOrderDetail> = {};
