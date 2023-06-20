package com.resteam.smartway.domain;

import java.io.Serializable;
import java.util.Optional;
import java.util.UUID;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "restaurant")
public class Restaurant extends AbstractAuditingEntity<String> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @Column(name = "id", length = 30)
    private String id;

    @Column(name = "name")
    private String name;

    public Restaurant(String id) {
        this.id = id;
    }

    public Restaurant(Optional<Restaurant> restaurant) {
        super();
    }
}
