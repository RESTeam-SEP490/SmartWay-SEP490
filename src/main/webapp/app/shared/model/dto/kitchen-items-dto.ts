import { IItemAdditionNotification } from '../order/item-addition-notfication.model';
import { IReadyToServeNotification } from '../order/ready-to-serve-notfication.model';

export interface IKitchenItems {
  itemAdditionNotificationList?: IItemAdditionNotification[];
  readyToServeNotificationList?: IReadyToServeNotification[];
}

export const defaultValue: IKitchenItems = {
  itemAdditionNotificationList: [],
  readyToServeNotificationList: [],
};
