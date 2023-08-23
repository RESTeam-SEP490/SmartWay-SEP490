export interface IRevenueByTime {
  totalRevenue?: number;
  totalOrders?: number;
  date?: string;
}

export const defaultValue: Readonly<IRevenueByTime> = {};
