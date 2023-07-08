import restaurant from './restaurant/restaurant.reducer';
import menuItem from './menu-item/menu-item.reducer';
import menuItemCategory from './menu-item-category/menu-item-category.reducer';
import staff from './staff/staff.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  restaurant,
  menuItem,
  menuItemCategory,
  staff,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
