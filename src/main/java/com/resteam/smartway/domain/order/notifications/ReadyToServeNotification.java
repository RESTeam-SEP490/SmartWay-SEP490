package com.resteam.smartway.domain.order.notifications;

import com.resteam.smartway.domain.base.AbstractBaseEntity;
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
@Table(name = "ready_to_serve_notification")
public class ReadyToServeNotification extends AbstractBaseEntity {

    @Id
    @GeneratedValue
    @Column(name = "id", columnDefinition = "BINARY(16)")
    private UUID id;

    private int quantity;

    @Column(name = "served_quantity", nullable = false)
    private int servedQuantity;

    @ManyToOne
    @JoinColumn(name = "item_addition_notification_id", referencedColumnName = "id", columnDefinition = "BINARY(16)")
    private ItemAdditionNotification itemAdditionNotification;

    @OneToMany(mappedBy = "readyToServeNotification", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemCancellationNotification> itemCancellationNotificationList = new ArrayList<>();

    @Column(name = "is_completed", nullable = false)
    private boolean isCompleted = false;

    @CreatedDate
    @Column(name = "notified_time", nullable = false, updatable = false)
    private Instant notifiedTime;

    @CreatedBy
    @Column(name = "created_by", nullable = false, length = 50, updatable = false)
    private String createdBy;
}
