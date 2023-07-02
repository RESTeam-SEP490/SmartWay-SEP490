package com.resteam.smartway.security.multitenancy.listener;

import com.resteam.smartway.domain.AbstractBaseEntity;
import com.resteam.smartway.security.multitenancy.context.RestaurantContext;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.util.Objects;
import javax.persistence.PrePersist;
import javax.persistence.PreRemove;
import javax.persistence.PreUpdate;

public class BaseEntityListener {

    @PrePersist
    @PreUpdate
    public void prePersistAndUpdate(Object object) {
        if (object instanceof AbstractBaseEntity) {
            ((AbstractBaseEntity) object).setRestaurant(RestaurantContext.getCurrentRestaurant());
        }
    }

    @PreRemove
    public void preRemove(Object object) {
        if (
            object instanceof AbstractBaseEntity &&
            !Objects.equals(((AbstractBaseEntity) object).getRestaurant().getId(), RestaurantContext.getCurrentRestaurant().getId())
        ) {
            throw new BadRequestAlertException("Invalid ID", " ", "idnotfound");
        }
    }
}
