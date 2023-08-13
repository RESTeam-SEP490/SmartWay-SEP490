import menuItem from './menu-item/menu-item.reducer';
import menuItemCategory from './menu-item-category/menu-item-category.reducer';
import staff from './staff/staff.reducer';
import role from './role/role.reducer';
import diningTable from './dining-table/dining-table.reducer';
import zone from './zone/zone.reducer';
import tenant from './tenant-profile/tenant-profile.reducer';
import changePassword from './tenant-profile/tenant-change-password.reducer';
import order from '../selling/order/order.reducer';
import kitchen from '../selling/kitchen/kitchen.reducer';
import bankAccount from '../check-bank-account-tenant/check-bank-account-tenant.reducer';
import restaurant from '../restaurant-setting/restaurant.reducer';
import statistic from './dashboard/dashboard.reduce';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  restaurant,
  menuItem,
  menuItemCategory,
  staff,
  diningTable,
  zone,
  role,
  tenant,
  changePassword,
  order,
  kitchen,
  bankAccount,
  statistic,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
