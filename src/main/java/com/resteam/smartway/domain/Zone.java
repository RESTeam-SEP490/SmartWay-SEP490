package com.resteam.smartway.domain;

import com.resteam.smartway.domain.base.AbstractBaseAuditingEntity;
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
@Table(name = "zone")
public class Zone extends AbstractBaseAuditingEntity<UUID> {

    @Id
    @GeneratedValue(generator = "uuid-hibernate-generator")
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(name = "name")
    private String name;
}
