import { IZone } from './zone.model';

export type ITableStatus = 'BOOKED' | 'FREE' | 'BUSY' | 'INACTIVE';
export interface IDiningTable {
  id?: string;
  name?: string | null;
  status?: ITableStatus;
  zone?: IZone | null;
}

export const defaultValue: Readonly<IDiningTable> = {
  id: '',
  name: '',
  status: 'FREE',
  zone: null,
};
