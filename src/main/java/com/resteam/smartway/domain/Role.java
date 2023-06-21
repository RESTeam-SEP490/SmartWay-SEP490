package com.resteam.smartway.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.util.Collection;
import java.util.Set;
import java.util.UUID;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "role")
public class Role {

    @Id
    @GeneratedValue(generator = "uuid-hibernate-generator")
    @GenericGenerator(name = "uuid-hibernate-generator", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(name = "id", nullable = false, columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @ManyToOne
    @JoinColumn(name = "restaurant_id", referencedColumnName = "id", columnDefinition = "BINARY(16)", nullable = false)
    private Restaurant restaurant;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
        name = "role_authority",
        joinColumns = { @JoinColumn(name = "role_id", referencedColumnName = "id") },
        inverseJoinColumns = { @JoinColumn(name = "authority_name", referencedColumnName = "name") }
    )
    private Collection<Authority> authorities;

    public Role(String name, Restaurant restaurant, Set<Authority> authorities) {
        this.name = name;
        this.restaurant = restaurant;
        this.authorities = authorities;
    }
}
