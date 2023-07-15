import { IRestaurant } from 'app/shared/model/restaurant.model';
import { IRole } from 'app/shared/model/role';

export interface IStaff {
  id?: any;
  username?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  password?: string;
  langKey?: string;
  role?: IRole;
  restaurant?: IRestaurant;
}

export const defaultValue: Readonly<IStaff> = {};
