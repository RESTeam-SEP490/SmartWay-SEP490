package com.resteam.smartway.domain;

import java.io.Serializable;
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
public class MenuItem extends AbstractBaseAuditingEntity<UUID> implements Serializable {

    @Id
    @GeneratedValue(generator = "uuid-hibernate-generator")
    @GenericGenerator(name = "uuid-hibernate-generator", strategy = "org.hibernate.id.UUIDGenerator")
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(length = 8)
    private String code;

    @Column(nullable = false, columnDefinition = "nvarchar(50)")
    private String name;

    @Column(name = "image_key")
    private String imageKey;

    @Column(name = "base_price")
    private Double basePrice = 0.0;

    @Column(name = "sell_price", nullable = false)
    private Double sellPrice;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "is_in_stock", nullable = false)
    private Boolean isInStock;

    @Column(columnDefinition = "nvarchar(255)")
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "id", columnDefinition = "BINARY(16)")
    private MenuItemCategory menuItemCategory;
}
