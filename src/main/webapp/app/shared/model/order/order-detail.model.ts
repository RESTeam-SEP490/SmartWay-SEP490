import { IMenuItem } from '../menu-item.model';

export interface IOrderDetail {
  id?: string;
  orderId?: string | null;
  menuItem?: IMenuItem | null;
  quantity?: number | 0;
  unnotifiedQuantity?: number | 0;
  servedQuantity?: number | 0;
  priority?: boolean | null;
  hasReadyToServeItem?: boolean | null;
  notifiedTime?: Date | null;
  note?: string | null;
}

export const defaultValue: Readonly<IOrderDetail> = {};
