export interface ICancellationStatistic {
  outOfStockQuantity?: number;
  exchangeItemQuantity?: number;
  longWaitingTimeQuantity?: number;
  customerUnsatisfiedQuantity?: number;
  othersQuantity?: number;
  date?: string;
}

export const defaultValue: Readonly<ICancellationStatistic> = {};
