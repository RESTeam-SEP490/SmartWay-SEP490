import { IDiningTable } from '../dining-table.model';
import { IItemCancellationNotification } from './item-cancellation-notification.model';
import { IReadyToServeNotification } from './ready-to-serve-notfication.model';

export interface IItemAdditionNotification {
  id?: string;
  createdBy?: string | null;
  notifiedTime?: string;
  quantity?: number | 0;
  note?: string | null;
  menuItemName?: string | null;
  orderDetailId?: string | null;
  tableList?: IDiningTable[] | [];
  priority?: boolean | null;
  itemCancellationNotificationList?: IItemCancellationNotification[];
  readyToServeNotificationList?: IReadyToServeNotification[];
}

export const defaultValue: Readonly<IItemAdditionNotification> = {};
