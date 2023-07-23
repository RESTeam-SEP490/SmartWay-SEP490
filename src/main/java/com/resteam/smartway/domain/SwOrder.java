package com.resteam.smartway.domain;

import java.io.Serializable;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
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
@Table(name = "sw_order")
public class SwOrder extends AbstractBaseAuditingEntity<UUID> implements Serializable {

    @Id
    @GeneratedValue
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(length = 8)
    private String code;

    @OneToMany
    @JoinColumn(name = "order_id")
    private List<OrderDetail> items = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "table_id", referencedColumnName = "id", columnDefinition = "BINARY(16)")
    private DiningTable table;

    private boolean isPaid;

    @Column(name = "pay_date")
    private Instant payDate;
}
