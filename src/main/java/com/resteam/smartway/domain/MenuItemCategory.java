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
@Table(name = "menu_item_category")
public class MenuItemCategory extends AbstractBaseAuditingEntity<UUID> {

    @Id
    @GeneratedValue
    @Column(columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(columnDefinition = "NVARCHAR(30)", nullable = false)
    private String name;
}
