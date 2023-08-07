package com.resteam.smartway.domain.order;

import com.resteam.smartway.domain.MenuItem;
import com.resteam.smartway.domain.base.AbstractBaseEntity;
import com.resteam.smartway.domain.order.notifications.ItemAdditionNotification;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "order_detail")
public class OrderDetail extends AbstractBaseEntity {

    @Id
    @GeneratedValue
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id", columnDefinition = "BINARY(16)")
    private SwOrder order;

    @ManyToOne
    @JoinColumn(name = "menu_item_id", referencedColumnName = "id", columnDefinition = "BINARY(16)")
    private MenuItem menuItem;

    private int quantity;

    @Column(name = "unnotified_quantity")
    private int unnotifiedQuantity;

    @OneToMany(mappedBy = "orderDetail")
    private List<ItemAdditionNotification> itemAdditionNotificationList = new ArrayList<>();

    @Column(name = "served_quantity")
    private int servedQuantity;

    @Column(name = "is_priority", nullable = false)
    private boolean isPriority = false;

    @Column(name = "note")
    private String note;

    @CreatedDate
    @Column(name = "created_date", nullable = false)
    private Instant createdDate = Instant.now();

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof OrderDetail) {
            OrderDetail orderDetail = (OrderDetail) obj;
            return orderDetail.getCreatedDate().isBefore(this.createdDate);
        }
        return super.equals(obj);
    }
}
