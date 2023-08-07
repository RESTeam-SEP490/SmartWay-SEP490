import { IItemAdditionNotification } from './item-addition-notfication.model';
import { IItemCancellationNotification } from './item-cancellation-notification.model';

export interface IKitchenNotificationHistory {
  id?: string;
  createdBy?: string;
  notifiedTime?: string;
  itemAdditionNotificationList?: IItemAdditionNotification[];
  itemCancellationNotificationList?: IItemCancellationNotification[];
}

export const defaultValue: Readonly<IKitchenNotificationHistory> = {};
