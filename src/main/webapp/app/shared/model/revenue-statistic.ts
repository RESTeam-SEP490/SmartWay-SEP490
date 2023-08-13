import { IRestaurant } from 'app/shared/model/restaurant.model';
import { IRevenueByTime } from './revenue-by-time';

export interface IRevenueStatistic {
  totalRevenue?: number;
  totalOrders?: number;
  statisticDTOS?: IRevenueByTime[];
}

export const defaultValue: Readonly<IRevenueStatistic> = {
  totalOrders: 0,
  totalRevenue: 0,
  statisticDTOS: [],
};
