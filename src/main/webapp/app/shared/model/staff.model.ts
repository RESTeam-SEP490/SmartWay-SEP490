import { IRestaurant } from 'app/shared/model/restaurant.model';
import { IRole } from 'app/shared/model/role';

export interface IStaff {
  id?: any;
  username?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  password?: string;
  role?: IRole;
  restaurant?: IRestaurant;
  isActive?: boolean | null;
}

export const defaultValue: Readonly<IStaff> = {};
