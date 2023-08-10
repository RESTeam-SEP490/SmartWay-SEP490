export interface IRestaurant {
  id?: number;
  name?: string | null;
  phone?: string | null;
  currencyUnit?: string | null;
}

export const defaultValue: Readonly<IRestaurant> = {};
