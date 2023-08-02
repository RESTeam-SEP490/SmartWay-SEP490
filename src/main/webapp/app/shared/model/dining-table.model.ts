import { IZone } from './zone.model';

export interface IDiningTable {
  id?: string;
  name?: string | null;
  isActive?: boolean | null;
  isFree?: boolean | null;
  numberOfSeats?: number | null;
  zone?: IZone | null;
}

export const defaultValue: Readonly<IDiningTable> = {
  id: '',
  name: '',
  isActive: null,
  isFree: null,
  numberOfSeats: null,
  zone: null,
};
