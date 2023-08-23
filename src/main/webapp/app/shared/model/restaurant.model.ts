export interface IRestaurant {
  id?: number;
  name?: string | null;
  phone?: string | null;
  currencyUnit?: string | null;
  address?: string | null;
  planExpiry?: string | null;
  stripeSubscriptionId?: string | null;
  isNew?: boolean;
}

export const defaultValue: Readonly<IRestaurant> = {};
