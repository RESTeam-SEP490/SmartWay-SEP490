package com.resteam.smartway.domain;

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
@Table(name = "order_detail")
public class OrderDetail {

    @Id
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(length = 8)
    private String code;

    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id", columnDefinition = "BINARY(16)")
    private SwOrder swOrder;

    @ManyToOne
    @JoinColumn(name = "menu_item_id", referencedColumnName = "id", columnDefinition = "BINARY(16)")
    private MenuItem menuItem;

    private int quantity;
}
