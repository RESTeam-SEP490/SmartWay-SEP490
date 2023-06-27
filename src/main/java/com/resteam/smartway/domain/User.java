package com.resteam.smartway.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.io.Serializable;
import java.time.Instant;
import java.util.UUID;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.GenericGenerator;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@NamedEntityGraph(
    name = "user-with-authorities-entity-graph",
    attributeNodes = { @NamedAttributeNode(value = "role", subgraph = "authority-subgraph") },
    subgraphs = { @NamedSubgraph(name = "authority-subgraph", attributeNodes = { @NamedAttributeNode("authorities") }) }
)
@Table(name = "user")
public class User extends AbstractBaseAuditingEntity<UUID> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(generator = "uuid-hibernate-generator")
    @GenericGenerator(name = "uuid-hibernate-generator", strategy = "org.hibernate.id.UUIDGenerator")
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

    @Column(name = "lang_key", length = 10)
    private String langKey;

    @JsonIgnore
    @Column(name = "reset_key", length = 20)
    private String resetKey;

    @Column(name = "reset_date")
    private Instant resetDate = null;

    @ManyToOne
    @JoinColumn(name = "role_id", referencedColumnName = "id", columnDefinition = "BINARY(16)")
    private Role role;
}
