import restaurant from 'app/entities/restaurant/restaurant.reducer';
import menuItem from 'app/entities/menu-item/menu-item.reducer';
import menuItemCategory from './menu-item/menu-item-category/menu-item-category.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  restaurant,
  menuItem,
  menuItemCategory,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
