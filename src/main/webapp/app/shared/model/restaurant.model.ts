export interface IRestaurant {
  id?: number;
  name?: string | null;
  phone?: string | null;
  currencyUnit?: string | null;
  planExpiry?: Date | null;
  langKey?: string;
}

export const defaultValue: Readonly<IRestaurant> = {};
