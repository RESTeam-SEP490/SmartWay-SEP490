export const ITEMS_PER_PAGE = 20;
export const ASC = 'asc';
export const DESC = 'desc';
export const SORT = 'sort';
export const DEFAULT_PAGINATION_CONFIG = {
  defaultPageSize: 10,
  showSizeChanger: true,
  pageSizeOptions: ['10', '15', '20', '30', '50'],
  showTotal: (total, range) => `${range[0]} - ${range[1]} of ${total} items`,
};
