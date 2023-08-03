import { IRestaurant } from 'app/shared/model/restaurant.model';
import { IUser } from 'app/shared/model/user.model';

export interface IBankAccountInfo {
  id?: string;
  accountNumber?: string | null;
  bankName?: string | null;
  restaurant?: IRestaurant;
  user?: IUser;
}

export const defaultValue: Readonly<IBankAccountInfo> = {};
