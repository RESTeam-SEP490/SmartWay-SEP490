package com.resteam.smartway.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.resteam.smartway.domain.base.AbstractBaseAuditingEntity;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;
import javax.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@NamedEntityGraph(
    name = "user-with-authorities-entity-graph",
    attributeNodes = { @NamedAttributeNode(value = "role", subgraph = "authority-subgraph") },
    subgraphs = { @NamedSubgraph(name = "authority-subgraph", attributeNodes = { @NamedAttributeNode("authorities") }) }
)
@Table(name = "user")
public class User extends AbstractBaseAuditingEntity<UUID> {

    @Id
    @GeneratedValue
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(length = 50, nullable = false)
    private String username;

    @JsonIgnore
    @Column(name = "password_hash", length = 60, nullable = false)
    private String password;

    @Column(name = "full_name", length = 100)
    private String fullName;

    private String email;

    @Column(length = 20)
    private String phone;

    private Date birthday;

    private String gender;

    @Column(length = 100)
    private String address;

    @Column(name = "lang_key", length = 10)
    private String langKey;

    @JsonIgnore
    @Column(name = "reset_key", length = 20)
    private String resetKey;

    @Column(name = "reset_date")
    private Instant resetDate = null;

    @Column(name = "is_system_admin", columnDefinition = "BIT(1) DEFAULT FALSE")
    private Boolean isSystemAdmin = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @ManyToOne
    @JoinColumn(name = "role_id", referencedColumnName = "id", columnDefinition = "BINARY(16)")
    private Role role;
}
