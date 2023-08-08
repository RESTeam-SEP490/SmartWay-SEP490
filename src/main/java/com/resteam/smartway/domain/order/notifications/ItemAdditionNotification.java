package com.resteam.smartway.domain.order.notifications;

import com.resteam.smartway.domain.base.AbstractBaseEntity;
import com.resteam.smartway.domain.order.OrderDetail;
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
@Table(name = "item_addition_notification")
public class ItemAdditionNotification extends AbstractBaseEntity {

    @Id
    @GeneratedValue
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    private int quantity;

    @ManyToOne
    @JoinColumn(name = "order_detail_id", referencedColumnName = "id", columnDefinition = "BINARY(16)")
    private OrderDetail orderDetail;

    @Column(name = "is_priority", nullable = false)
    private boolean isPriority;

    @Column(name = "note")
    private String note;

    @ManyToOne
    @JoinColumn(name = "kitchen_notification_history_id", referencedColumnName = "id", columnDefinition = "BINARY(16)")
    private KitchenNotificationHistory kitchenNotificationHistory;

    @OneToMany(mappedBy = "itemAdditionNotification", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemCancellationNotification> itemCancellationNotificationList = new ArrayList<>();

    @OneToMany(mappedBy = "itemAdditionNotification", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ReadyToServeNotification> readyToServeNotificationList = new ArrayList<>();

    @Column(name = "is_completed", nullable = false)
    private boolean isCompleted = false;
}
