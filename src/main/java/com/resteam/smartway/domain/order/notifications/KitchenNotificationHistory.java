package com.resteam.smartway.domain.order.notifications;

import com.resteam.smartway.domain.base.AbstractBaseEntity;
import com.resteam.smartway.domain.order.SwOrder;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "kitchen_notification_history")
public class KitchenNotificationHistory extends AbstractBaseEntity {

    @Id
    @GeneratedValue
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id", columnDefinition = "BINARY(16)")
    private SwOrder order;

    @CreatedDate
    @Column(name = "notified_time", nullable = false, updatable = false)
    private Instant notifiedTime;

    @CreatedBy
    @Column(name = "created_by", nullable = false, length = 50, updatable = false)
    private String createdBy;

    @OneToMany(mappedBy = "kitchenNotificationHistory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemAdditionNotification> itemAdditionNotificationList = new ArrayList<>();

    @OneToMany(mappedBy = "kitchenNotificationHistory", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemCancellationNotification> itemCancellationNotificationList = new ArrayList<>();

    @Override
    public boolean equals(Object obj) {
        if (obj instanceof KitchenNotificationHistory) {
            KitchenNotificationHistory history = (KitchenNotificationHistory) obj;
            return history.getNotifiedTime().isBefore(this.notifiedTime);
        }
        return super.equals(obj);
    }
}
