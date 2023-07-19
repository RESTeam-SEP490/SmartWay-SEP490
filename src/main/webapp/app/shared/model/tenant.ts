import { IRole } from 'app/shared/model/role';
import dayjs from 'dayjs';

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
  birthday?: dayjs.Dayjs;
  resetPassword?: string;
}

export const defaultValue: Readonly<ITenant> = {};
