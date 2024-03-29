package com.resteam.smartway.domain.order.notifications;

import com.resteam.smartway.domain.base.AbstractBaseEntity;
import com.resteam.smartway.domain.enumeration.CancellationReason;
import com.resteam.smartway.domain.order.OrderDetail;
import java.util.UUID;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "item_cancellation_notification")
public class ItemCancellationNotification extends AbstractBaseEntity {

    @Id
    @GeneratedValue
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    private int quantity;

    @ManyToOne
    @JoinColumn(name = "item_addition_notification_id", referencedColumnName = "id", columnDefinition = "BINARY(16)")
    private ItemAdditionNotification itemAdditionNotification;

    @ManyToOne
    @JoinColumn(name = "ready_to_serve_notification_id", referencedColumnName = "id", columnDefinition = "BINARY(16)")
    private ReadyToServeNotification readyToServeNotification;

    @ManyToOne
    @JoinColumn(name = "order_detail_id", referencedColumnName = "id", columnDefinition = "BINARY(16)")
    private OrderDetail orderDetail;

    @ManyToOne
    @JoinColumn(name = "kitchen_notification_history_id", referencedColumnName = "id", columnDefinition = "BINARY(16)")
    private KitchenNotificationHistory kitchenNotificationHistory;

    @Column(name = "cancellation_reason")
    @Enumerated(EnumType.STRING)
    private CancellationReason cancellationReason;

    @Column(name = "cancellation_note")
    private String cancellationNote;
}
