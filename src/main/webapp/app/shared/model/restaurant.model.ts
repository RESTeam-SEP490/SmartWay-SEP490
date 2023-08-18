export interface IRestaurant {
  id?: number;
  name?: string | null;
  phone?: string | null;
  currencyUnit?: string | null;
  planExpiry?: Date | null;
}

export const defaultValue: Readonly<IRestaurant> = {};
