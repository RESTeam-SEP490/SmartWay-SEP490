import { IMenuItemCategory } from './menu-item-category.model';

export interface IMenuItem {
  id?: string;
  name?: string | null;
  imageUrl?: string | null;
  basePrice?: number | 0;
  sellPrice?: number | 0;
  isExtraItem?: boolean | null;
  menuItemCategoryId?: IMenuItemCategory | null;
  extraItemSet?: [] | null;
}

export const defaultValue: Readonly<IMenuItem> = {};
