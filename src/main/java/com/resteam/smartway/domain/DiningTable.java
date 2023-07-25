package com.resteam.smartway.domain;

import java.io.Serializable;
import java.util.UUID;
import javax.persistence.*;
import javax.validation.constraints.Min;
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
@Table(name = "dining_table")
public class DiningTable extends AbstractBaseAuditingEntity<UUID> implements Serializable {

    @Id
    @GeneratedValue(generator = "uuid-hibernate-generator")
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(name = "name")
    private String name;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "is_free", nullable = false)
    private Boolean isFree;

    @Column(name = "number_of_seats")
    private Integer numberOfSeats;

    @ManyToOne
    @JoinColumn(name = "zone_id", referencedColumnName = "id")
    private Zone zone;
}
