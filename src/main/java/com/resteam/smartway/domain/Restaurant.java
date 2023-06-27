package com.resteam.smartway.domain;

import java.io.Serializable;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.FilterDef;
import org.hibernate.annotations.ParamDef;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@FilterDef(name = "restaurantIdFilter", parameters = { @ParamDef(name = "id", type = "string") })
@Table(name = "restaurant")
public class Restaurant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id", length = 30, nullable = false)
    private String id;

    @Column(name = "name")
    private String name;

    public Restaurant(String id) {
        this.id = id;
    }
}
