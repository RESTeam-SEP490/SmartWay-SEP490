export interface IRestaurantWithAdmin {
  id?: string;
  name?: string | null;
  phone?: string | null;
  currencyUnit?: string | null;
  planExpiry?: string | null;
  langKey?: string | null;
  isActive?: boolean | null;
}

export const defaultValue: Readonly<IRestaurantWithAdmin> = {};
