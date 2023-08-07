import { IRole } from 'app/shared/model/role';
import { Moment } from 'moment';

export interface ITenant {
  id?: any;
  username?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  address?: string;
  role?: IRole;
  password?: string;
  langKey?: string;
  birthday?: Moment | null;
  gender?: string;
  newPassword?: string;
}

export const defaultValue: Readonly<ITenant> = {};
