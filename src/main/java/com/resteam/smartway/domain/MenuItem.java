package com.resteam.smartway.domain;

import java.io.Serializable;
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
@Table(name = "menu_item")
public class MenuItem extends AbstractAuditingEntity<UUID> implements Serializable {

    @Id
    @GeneratedValue(generator = "uuid-hibernate-generator")
    @GenericGenerator(name = "uuid-hibernate-generator", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    private String code;

    @Column(length = 50, nullable = false)
    private String name;

    @Column(name = "image_key")
    private String imageKey;

    @Column(name = "base_price")
    private Double basePrice = 0.0;

    @Column(name = "sell_price", nullable = false)
    private Double sellPrice;

    @Column(name = "is_extra_item")
    private Boolean isExtraItem;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "is_allow_sale")
    private Boolean isAllowSale;

    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", referencedColumnName = "id", columnDefinition = "BINARY(16)")
    private MenuItemCategory menuItemCategory;

    @ManyToMany
    @JoinTable(
        name = "extra_item_details",
        joinColumns = { @JoinColumn(name = "item_id", referencedColumnName = "id") },
        inverseJoinColumns = { @JoinColumn(name = "extra_item_id", referencedColumnName = "id") }
    )
    private Set<MenuItem> extraItemSet;
}
