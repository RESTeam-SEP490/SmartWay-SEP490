package com.resteam.smartway.security.multitenancy.aspect;

import com.resteam.smartway.config.Constants;
import com.resteam.smartway.security.multitenancy.annotation.DisableRestaurantFilter;
import com.resteam.smartway.security.multitenancy.context.RestaurantContext;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.reflect.MethodSignature;
import org.hibernate.Session;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class RestaurantAspect {

    @PersistenceContext
    private EntityManager entityManager;

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
}
