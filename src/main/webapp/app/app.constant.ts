import dayjs from 'dayjs';
import { IItemAdditionNotification } from './shared/model/order/item-addition-notfication.model';
import { IQueryParams } from './shared/reducers/reducer.utils';
import { IReadyToServeNotification } from './shared/model/order/ready-to-serve-notfication.model';
import { IDiningTable } from './shared/model/dining-table.model';

export const DEFAULT_PAGEABLE: IQueryParams = {
  search: null,
  page: 0,
  size: 10,
  sort: 'createdDate,DESC',
};

export type FormType = 'edit' | 'delete';
export type AppType = 'main' | 'tenant' | 'admin';
export const DEFAULT_FORM_ITEM_LAYOUT = {
  labelCol: { span: 8 },
  wrapperCol: { span: 18 },
};

export const DOMAIN_DEV = 'localhost:9000';
export const DOMAIN_PROD = 'smart-way.website';

export const currencyFormatter = value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
export function toNonAccentVietnamese(str) {
  str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, 'A');
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, 'E');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/I|Í|Ì|Ĩ|Ị/g, 'I');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, 'O');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, 'U');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, 'Y');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/Đ/g, 'D');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  str = str.replace(/đ/g, 'd');
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // Huyền sắc hỏi ngã nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ''); // Â, Ê, Ă, Ơ, Ư
  return str;
}

export const itemAdditionCompare = (a: IItemAdditionNotification, b: IItemAdditionNotification) => {
  if (dayjs(a.notifiedTime).isAfter(dayjs(b.notifiedTime))) return 1;
  if (dayjs(a.notifiedTime).isBefore(dayjs(b.notifiedTime))) return -1;
  if (JSON.stringify(b.tableList) === JSON.stringify(a.tableList)) {
    if (a.priority) return -1;
  }
};

export const readyToServeItemCompare = (a: IReadyToServeNotification, b: IReadyToServeNotification) => {
  if (dayjs(a.notifiedTime).isAfter(dayjs(b.notifiedTime))) return 1;
  if (dayjs(a.notifiedTime).isBefore(dayjs(b.notifiedTime))) return -1;
};

export const alphabetCompare = (a: IDiningTable, b: IDiningTable) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }
  return 0;
};
