import { IRestaurant } from 'app/shared/model/restaurant.model';

export interface IStaff {
  id?: any;
  username?: string;
  fullName?: string;
  email?: string;
  langKey?: string;
  restaurant?: IRestaurant;
}

export const defaultValue: Readonly<IStaff> = {
  id: '',
  username: '',
  fullName: '',
  email: '',
  langKey: '',
};
