package com.resteam.smartway.security.multitenancy.context;

import com.resteam.smartway.domain.Restaurant;

public class RestaurantContext {

    private static ThreadLocal<Restaurant> currentRestaurant = new ThreadLocal<>();

    public static Restaurant getCurrentRestaurant() {
        return currentRestaurant.get();
    }

    public static void setCurrentRestaurant(Restaurant restaurant) {
        currentRestaurant.set(restaurant);
    }

    public static void setCurrentRestaurantById(String id) {
        currentRestaurant.set(new Restaurant(id));
    }
}
