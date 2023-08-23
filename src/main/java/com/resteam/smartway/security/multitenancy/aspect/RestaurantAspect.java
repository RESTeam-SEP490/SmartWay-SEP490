package com.resteam.smartway.security.multitenancy.aspect;

import com.resteam.smartway.config.Constants;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.repository.RestaurantRepository;
import com.resteam.smartway.security.multitenancy.annotation.DisableRestaurantFilter;
import com.resteam.smartway.security.multitenancy.context.RestaurantContext;
import com.resteam.smartway.web.rest.errors.BadRequestAlertException;
import java.time.Instant;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class RestaurantAspect {

    @PersistenceContext
    private EntityManager entityManager;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Before("execution(* com.resteam.smartway.security.multitenancy.repository.BaseRepository+.find*(..))")
    public void beforeFindOfTenantableRepository(JoinPoint joinPoint) {
        entityManager.unwrap(Session.class).disableFilter(Constants.RESTAURANT_FILTER_NAME);
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();

        if (AnnotationUtils.getAnnotation(methodSignature.getMethod(), DisableRestaurantFilter.class) == null) {
            entityManager
                .unwrap(Session.class)
                .enableFilter(Constants.RESTAURANT_FILTER_NAME)
                .setParameter("restaurantId", RestaurantContext.getCurrentRestaurant().getId());
        }
    }

    @Pointcut("@annotation(com.resteam.smartway.security.multitenancy.annotation.RestaurantRestricted)")
    public void restaurantRestrictedMethods() {}

    @AfterReturning("restaurantRestrictedMethods()")
    public void enforceRestaurantAccessControl() {
        Restaurant restaurant = restaurantRepository
            .findOneById(RestaurantContext.getCurrentRestaurant().getId())
            .orElseThrow(() -> new BadRequestAlertException("Restaurant not found", "restaurant", "idnotfound"));
        if (restaurant.getPlanExpiry().isBefore(Instant.now())) {
            throw new BadRequestAlertException("Restaurant was expired", "restaurant", "restaurantExpired");
        }
    }
}
