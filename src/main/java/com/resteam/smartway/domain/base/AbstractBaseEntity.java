package com.resteam.smartway.domain.base;

import com.resteam.smartway.config.Constants;
import com.resteam.smartway.domain.Restaurant;
import com.resteam.smartway.security.multitenancy.listener.BaseEntityListener;
import java.io.Serializable;
import javax.persistence.EntityListeners;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.Filter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

@MappedSuperclass
@Getter
@Setter
@FilterDef(
    name = Constants.RESTAURANT_FILTER_NAME,
    parameters = { @ParamDef(name = "restaurantId", type = "string") },
    defaultCondition = "restaurant_id = :restaurantId"
)
@Filter(name = Constants.RESTAURANT_FILTER_NAME)
@EntityListeners(BaseEntityListener.class)
public abstract class AbstractBaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @ManyToOne
    @JoinColumn(referencedColumnName = "id", name = "restaurant_id", nullable = false)
    private Restaurant restaurant;
}
