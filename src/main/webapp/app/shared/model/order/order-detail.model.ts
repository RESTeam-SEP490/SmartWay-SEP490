import { IMenuItem } from '../menu-item.model';

export interface IOrderDetail {
  id?: string;
  orderId?: string | null;
  menuItem?: IMenuItem | null;
  quantity?: number;
  unnotifiedQuantity?: number;
  servedQuantity?: number;
  priority?: boolean | null;
  readyToServeQuantity?: number;
  notifiedTime?: Date | null;
  note?: string | null;
}

export const defaultValue: Readonly<IOrderDetail> = {};
