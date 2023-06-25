import { IQueryParams } from './shared/reducers/reducer.utils';

export const DEFAULT_PAGEABLE: IQueryParams = {
  query: null,
  page: 0,
  size: 10,
  sort: 'createdDate,DESC',
};

export const DEFAULT_FORM_ITEM_LAYOUT = {
  labelCol: { span: 6 },
  wrapperCol: { span: 20 },
};

export const currencyFormatter = value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
