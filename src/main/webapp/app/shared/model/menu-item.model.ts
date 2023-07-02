import { IMenuItemCategory } from './menu-item-category.model';

export interface IMenuItem {
  id?: string;
  name?: string | null;
  code?: string | null;
  imageSource?: any;
  imageUrl?: string | null;
  description?: string | null;
  basePrice?: number | 0;
  sellPrice?: number | 0;
  isActive?: boolean | null;
  isInStock?: boolean | null;
  menuItemCategory?: IMenuItemCategory | null;
}

export const defaultValue: Readonly<IMenuItem> = {};
