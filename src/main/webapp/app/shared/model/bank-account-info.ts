import { IRestaurant } from 'app/shared/model/restaurant.model';

export interface IBankAccountInfo {
  id?: string;
  accountNumber?: string | null;
  bankName?: string | null;
  logoBank?: string | null;
  bin?: string | null;
  fullNameBankAccount?: string | null;
  default?: boolean | null;
  active?: boolean | null;
  restaurant?: IRestaurant;
}

export const defaultValue: Readonly<IBankAccountInfo> = {};
