import { IItemAdditionNotification } from './item-addition-notfication.model';

export interface IKitchenNotificationHistory {
  id?: string;
  createdBy?: string;
  notifiedTime?: string;
  itemAdditionNotificationList?: IItemAdditionNotification[];
}

export const defaultValue: Readonly<IKitchenNotificationHistory> = {};
