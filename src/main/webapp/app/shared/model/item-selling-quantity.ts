import { IMenuItem } from './menu-item.model';

export type IItemSellingQuantity = {
  menuItem?: IMenuItem;
  quantity?: number;
  revenue?: number;
};
