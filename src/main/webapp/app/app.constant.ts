import { IQueryParams } from './shared/reducers/reducer.utils';

export const DEFAULT_PAGEABLE: IQueryParams = {
  query: null,
  page: 0,
  size: 10,
  sort: 'id',
};
