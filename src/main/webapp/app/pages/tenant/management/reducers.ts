import restaurant from './restaurant/restaurant.reducer';
import menuItem from './menu-item/menu-item.reducer';
import menuItemCategory from './menu-item-category/menu-item-category.reducer';
import staff from './staff/staff.reducer';
import role from './role/role.reducer';
import diningTable from './dining-table/dining-table.reducer';
import zone from './zone/zone.reducer';
import tenant from './tenant-profile/tenant-profile.reducer';
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
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
