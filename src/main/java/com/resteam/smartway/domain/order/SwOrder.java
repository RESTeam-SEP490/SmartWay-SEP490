package com.resteam.smartway.domain.order;

import com.resteam.smartway.domain.BankAccountInfo;
import com.resteam.smartway.domain.DiningTable;
import com.resteam.smartway.domain.base.AbstractBaseAuditingEntity;
import com.resteam.smartway.domain.enumeration.CurrencyUnit;
import com.resteam.smartway.domain.order.notifications.KitchenNotificationHistory;
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
public class SwOrder extends AbstractBaseAuditingEntity<UUID> {

    @Id
    @GeneratedValue
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @Column(length = 8)
    private String code;

    @Column(name = "is_paid", nullable = false)
    private boolean isPaid;

    @Column(name = "is_pay_by_cash")
    private Boolean isPayByCash;

    @Column(name = "is_take_away", nullable = false)
    private boolean isTakeAway;

    @Column(name = "currency_unit")
    private CurrencyUnit currencyUnit;

    @Column(name = "discount")
    private Double discount;

    @Column(name = "is_completed")
    private boolean isCompleted;

    @ManyToOne
    @JoinColumn(name = "bank_account_info_id", referencedColumnName = "id")
    private BankAccountInfo bankAccountInfo;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderDetail> orderDetailList = new ArrayList<>();

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<KitchenNotificationHistory> kitchenNotificationHistoryList = new ArrayList<>();

    @ManyToMany
    @JoinTable(
        name = "order_table",
        joinColumns = { @JoinColumn(name = "order_id", referencedColumnName = "id") },
        inverseJoinColumns = { @JoinColumn(name = "table_id", referencedColumnName = "id") }
    )
    private List<DiningTable> tableList;

    @Column(name = "pay_date")
    private Instant payDate;
}
