import { IItemAdditionNotification } from './item-addition-notfication.model';
import { IItemCancellationNotification } from './item-cancellation-notification.model';

export interface IReadyToServeNotification {
  id?: string;
  createdBy?: string | null;
  notifiedTime?: string;
  quantity?: number;
  isCompleted?: boolean;
  itemAdditionNotification?: IItemAdditionNotification;
  itemCancellationNotificationList?: IItemCancellationNotification[];
}

export const defaultValue: Readonly<IReadyToServeNotification> = {};
