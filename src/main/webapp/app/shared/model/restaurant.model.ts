export interface IRestaurant {
  id?: number;
  name?: string | null;
  email?: string | null;
}

export const defaultValue: Readonly<IRestaurant> = {};
