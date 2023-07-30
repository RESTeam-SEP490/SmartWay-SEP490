import { IDiningTable } from '../dining-table.model';

export interface IItemAdditionNotification {
  id?: string;
  createdBy?: string | null;
  notifiedTime?: string;
  quantity?: number | 0;
  note?: string | null;
  menuItemName?: string | null;
  tableList?: IDiningTable[] | [];
  isCompleted?: boolean | null;
  isPriority?: boolean | null;
}

export const defaultValue: Readonly<IItemAdditionNotification> = {};
